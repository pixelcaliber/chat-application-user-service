import uuid
from datetime import datetime

from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_identity, jwt_required)
from flask_login import UserMixin
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

from utils import (FLASK_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES, JWT_SECRET_KEY,
                   POSTGRES_DB_URL)

app = Flask(__name__)
app.config["FLASK_SECRET_KEY"] = FLASK_SECRET_KEY
app.config["SQLALCHEMY_DATABASE_URI"] = POSTGRES_DB_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_SECURE"] = True
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_ACCESS_TOKEN_EXPIRES

bcrypt = Bcrypt(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


class User(db.Model, UserMixin):
    # id = db.Column(db.Integer, primary_key=True)
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


@app.cli.command("db_create")
def db_create():
    db.create_all()
    print("Database created!")


@app.cli.command("db_drop")
def db_drop():
    db.drop_all()
    print("Database dropped!")


@app.cli.command("db_seed")
def db_seed():
    new_user = User(
        id=uuid.uuid4(),
        username="admin",
        email="admin@example.com",
        password=bcrypt.generate_password_hash("admin_password").decode("utf-8"),
    )
    db.session.add(new_user)
    db.session.commit()
    print("Database seeded!")


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data["username"]

    # Check if username and email are not already taken
    existing_user = User.query.filter(
        (User.username == data["username"]) | (User.email == data["email"])
    ).first()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 400

    # Hash the password before saving to the database
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user_id = uuid.uuid4()
    # Create a new user
    new_user = User(
        id=user_id,
        username=data["username"],
        email=data["email"],
        password=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()

    # Generate access token for the new user
    access_token = create_access_token(
        identity={"username": new_user.username, "email": new_user.email, "user_id": new_user.id}
    )
    response = {"username": username, "user_id": user_id, "access_token": access_token}
    return jsonify(response), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, data["password"]):
        access_token = create_access_token(
            identity={"username": user.username, "email": user.email, "user_id": user.id}
        )
        response = {"username": username, "user_id": user.id, "access_token": access_token}
        return jsonify(response), 200
    return {"error": "Invalid username or password"}, 401


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return {"logged_in_as": current_user}, 200


@app.route("/users/<string:username>", methods=["GET"])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"username": user.username, "user_id": user.id}), 200
    return jsonify({"message": "User not found"}), 404


if __name__ == "__main__":
    app.run(port=5001, debug=True)

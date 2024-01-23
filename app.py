from flask import Flask, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from utils import JWT_ACCESS_TOKEN_EXPIRES, JWT_SECRET_KEY, FLASK_SECRET_KEY, POSTGRES_DB_URL

app = Flask(__name__)
app.config['FLASK_SECRET_KEY'] = FLASK_SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = POSTGRES_DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = True
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = JWT_ACCESS_TOKEN_EXPIRES

print(POSTGRES_DB_URL)

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Database created!')

@app.cli.command('db_drop')
def db_drop():
    db.drop_all()
    print('Database dropped!')

@app.cli.command('db_seed')
def db_seed():
    user = User(username='admin', email='admin@example.com', password='admin_password')
    db.session.add(user)
    db.session.commit()
    print('Database seeded!')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']

    # Check if username and email are not already taken
    existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
    if existing_user:
        return jsonify({'error': 'Username or email already exists'}), 400

    # Hash the password before saving to the database
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create a new user
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Generate access token for the new user
    access_token = create_access_token(identity={'username': new_user.username, 'email': new_user.email})
    response = f'User: {username} is successfully registered with the access_token: {access_token}'
    return {"Success": response}, 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'username': user.username, 'email': user.email})
        response = f'User: {username} is successfully logged in with the access_token: {access_token}'
        return {"Success": response}, 200

    return {'error': 'Invalid username or password'}, 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return {'logged_in_as': current_user}, 200


if __name__ == '__main__':
    app.run(debug=True)

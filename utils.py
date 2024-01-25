import os
from datetime import timedelta

FLASK_SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=int(15))
DB_NAME = os.environ.get('DB_NAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')

POSTGRES_DB_URL = 'postgresql://' + str(DB_NAME) + ':' + str(DB_PASSWORD) + '@localhost/chat-app-user-db'

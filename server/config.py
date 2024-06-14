
# Standard library imports
from os import environ
import os
from dotenv import load_dotenv

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt

# Load environment variables
load_dotenv('.env')

# Instantiate app, set attributes

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

app.secret_key = environ.get("SESSION_SECRET")

# Instantiate Bcrypt
flask_bcrypt = Bcrypt(app)

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

# Instantiate Migrate
migrate = Migrate(app, db)
db.init_app(app)
# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)
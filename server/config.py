from os import environ
import os
from dotenv import load_dotenv
from flask import Flask, Blueprint
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt

load_dotenv('.env')

DATABASE_URI = os.getenv('DATABASE_URI')
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__, static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build')

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
app.secret_key = environ.get("SESSION_SECRET")

flask_bcrypt = Bcrypt(app)
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

from config import *
import os
from flask_restful import Resource, Api
from flask import Flask, make_response, jsonify, request
from models import Employee, WorkLog, Expense, Project, db
from flask_cors import CORS
from flask_migrate import Migrate

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)
CORS(app)
api = Api(app)

@app.route('/')
def index():
    return '<h1>DNF construction</h1>'

class Employees(Resource):
    def get(self):
        employees = [employee.to_dict() for employee in Employee.query.all()]
        return make_response(jsonify(employees), 200)

    def post(self):
        data = request.get_json()
        new_employee = Employee(
            name=data['name'],
            email=data['email'],
            address=data['address'],
            password=data['password'],
            hourly_rate=data['hourly_rate'],
            phone_number=data['phone_number']
        )
        db.session.add(new_employee)
        db.session.commit()
        return make_response(jsonify(new_employee.to_dict()), 201)

api.add_resource(Employees, '/employees')

class EmployeesById(Resource):
    def get(self, id):
        employee = Employee.query.get(id)
        if employee is None:
            return make_response(jsonify(error='Employee not found'), 404)
        return make_response(jsonify(employee.to_dict()), 200)

    def patch(self, id):
        employee = Employee.query.get(id)
        if employee is None:
            return make_response(jsonify(error='Employee not found'), 404)
        for attr in request.get_json():
            setattr(employee, attr, request.get_json()[attr])
        db.session.commit()
        return make_response(jsonify(employee.to_dict()), 200)
    
    def delete(self, id):
        employee = Employee.query.get(id)
        if employee is None:
            return make_response(jsonify(error='Employee not found'), 404)
        db.session.delete(employee)
        db.session.commit()
        return make_response('', 204)
    
api.add_resource(EmployeesById, '/employees/<int:id>')




if __name__ == '__main__':
    app.run(port=5555, debug=True)
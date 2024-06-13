from config import db
import os
from flask_restful import Resource, Api
from flask import Flask, make_response, jsonify, request
from models import Employee, WorkLog, Expense, Project
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime

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
        
        data = request.get_json()
        
        if 'hours_worked' in data and 'project_id' in data:
            hours_worked = data['hours_worked']
            project_id = data['project_id']
            work_log = WorkLog(
                employee_id=id,
                project_id=project_id,
                hours_worked=hours_worked,
                date=datetime.today().date()
            )
            db.session.add(work_log)
        else:
            for attr in data:
                if hasattr(employee, attr):
                    setattr(employee, attr, data[attr])
        
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

class WorkLogs(Resource):
    def get(self):
        worklogs = [worklog.to_dict() for worklog in WorkLog.query.all()]
        return make_response(jsonify(worklogs), 200)
    
    def post(self):
        data = request.get_json()
        date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
        new_worklog = WorkLog(
            employee_id=data['employee_id'],
            project_id=data['project_id'],
            hours_worked=data['hours_worked'],
            date=date_obj
        )
        db.session.add(new_worklog)
        db.session.commit()
        return make_response(jsonify(new_worklog.to_dict()), 201)

api.add_resource(WorkLogs, '/worklogs')

class WorkLogByID(Resource):
    def get(self, id):
        worklog = WorkLog.query.get(id)
        if worklog is None:
            return make_response(jsonify(error='Worklog not found'), 404)
        return make_response(jsonify(worklog.to_dict()), 200)
    
    def patch(self, id):
        worklog = WorkLog.query.get(id)
        if worklog is None:
            return make_response(jsonify(error='Worklog not found'), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'date':
                try:
                    value = datetime.strptime(value, '%Y-%m-%d').date()
                except ValueError:
                    return make_response(jsonify({"error": "Invalid date format"}), 400)
            if hasattr(worklog, attr):
                setattr(worklog, attr, value)
        db.session.commit()
        return make_response(jsonify(worklog.to_dict()), 200)
    
    def delete(self, id):
        worklog = WorkLog.query.get(id)
        if worklog is None:
            return make_response(jsonify(error='Worklog not found'), 404)
        db.session.delete(worklog)
        db.session.commit()
        return make_response('', 204)

api.add_resource(WorkLogByID, '/worklogs/<int:id>')



class Projects(Resource):
    def get(self):
        projects = [project.to_dict() for project in Project.query.all()]
        return make_response(jsonify(projects), 200)
    
    def post(self):
        data = request.get_json()
        new_project = Project(
            name=data['name'],
            location=data['location'],
            description=data['description']
        )
        db.session.add(new_project)
        db.session.commit()
        return make_response(jsonify(new_project.to_dict()), 201)

api.add_resource(Projects, '/projects')

class ProjectsById(Resource):
    def get(self, id):
        project = Project.query.get(id)
        if project is None:
            return make_response(jsonify(error='Project not found'), 404)
        return make_response(jsonify(project.to_dict()), 200)
    
    def patch(self, id):
        project = Project.query.get(id)
        if project is None:
            return make_response(jsonify(error='Project not found'), 404)
        data = request.get_json()
        for attr in data:
            setattr(project, attr, data[attr])
        db.session.commit()
        return make_response(jsonify(project.to_dict()), 200)
    
    def delete(self, id):
        project = Project.query.get(id)
        if project is None:
            return make_response(jsonify(error='Project not found'), 404)
        db.session.delete(project)
        db.session.commit()
        return make_response('', 204)

api.add_resource(ProjectsById, '/projects/<int:id>')

class Expenses(Resource):
    def get(self):
        expenses = [expense.to_dict() for expense in Expense.query.all()]
        return make_response(jsonify(expenses), 200)
    
    def post(self):
        data = request.get_json()
        new_expense = Expense(
            description=data['description'],
            amount=data['amount'],
            project_id=data['project_id']
        )
        db.session.add(new_expense)
        db.session.commit()
        return make_response(jsonify(new_expense.to_dict()), 201)

api.add_resource(Expenses, '/expenses')

class ExpensesById(Resource):
    def get(self, id):
        expense = Expense.query.get(id)
        if expense is None:
            return make_response(jsonify(error='Expense not found'), 404)
        return make_response(jsonify(expense.to_dict()), 200)
    
    def patch(self, id):
        expense = Expense.query.get(id)
        if expense is None:
            return make_response(jsonify(error='Expense not found'), 404)
        data = request.get_json()

        if 'project_id' in data:
            project = Project.query.get(data['project_id'])
            if project is None:
                return make_response(jsonify(error='Project not found'), 404)
            expense.project = project

        for attr in data:
            if attr != 'project_id':
                setattr(expense, attr, data[attr])
        db.session.commit()
        return make_response(jsonify(expense.to_dict()), 200)
    
    def delete(self, id):
        expense = Expense.query.get(id)
        if expense is None:
            return make_response(jsonify(error='Expense not found'), 404)
        db.session.delete(expense)
        db.session.commit()
        return make_response('', 204)

api.add_resource(ExpensesById, '/expenses/<int:id>')





if __name__ == '__main__':
    app.run(port=5555, debug=True)
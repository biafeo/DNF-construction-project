from config import app, db, api, api_bp, os
from flask_restful import Resource
from flask import make_response, jsonify, request, session, render_template
from models import Employee, WorkLog, Expense, Project
from datetime import datetime


@api_bp.route('/')
def index():
    return render_template("index.html")

class Employees(Resource):
    def get(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        employees = [employee.to_dict() for employee in Employee.query.all()]
        return make_response(jsonify(employees), 200)

    def post(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        data = request.get_json()
        new_employee = Employee(
            name=data['name'],
            email=data['email'],
            address=data['address'],
            hourly_rate=data['hourly_rate'],
            phone_number=data['phone_number'],
            isBoss=data['isBoss']
        )
        new_employee.password_hash = data['password']
        db.session.add(new_employee)
        db.session.commit()
        return make_response(jsonify(new_employee.to_dict()), 201)

api.add_resource(Employees, '/employees')

@api_bp.route('/sign_in', methods=['POST'])
def sign_in():
    user_data = request.get_json()
    user = Employee.query.filter_by(email=user_data.get("email")).first()
    if not user:
        return make_response({"message": f"No user exists with email: {user_data.get('email')}"}, 404)
    if not user.authenticate(user_data.get("password")):
        return make_response({"message": "Incorrect email or password"}, 401)
    session["employee_id"] = user.id
    return make_response(jsonify(user.to_dict()), 200)

@api_bp.route('/sign_out', methods= ["DELETE"])
def sign_out():
    del session["employee_id"]
    return {}, 204

@api_bp.route("/me")
def me():
    user = db.session.get(Employee, session.get("employee_id"))
    if not user:
        return {}, 401
    return make_response(jsonify(user.to_dict()), 200)



class EmployeesById(Resource):
    def get(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user:
            return make_response({"message": "Unauthorized"}, 401)

        if user.isBoss or user_id == id:
            employee = db.session.get(Employee, id)
            if employee is None:
                return make_response(jsonify(error='Employee not found'), 404)
            return make_response(jsonify(employee.to_dict()), 200)
        else:
            return make_response({"message": "You don't have access to this page"}, 403)

    def patch(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user:
            return make_response({"message": "Unauthorized"}, 401)

        if user.isBoss or user_id == id:
            employee = db.session.get(Employee, id)
            if employee is None:
                return make_response(jsonify(error='Employee not found'), 404)

            data = request.get_json()

            if 'hours_worked' in data:
                hours_worked = data['hours_worked']
                project_id = data.get('project_id')
                work_log = WorkLog(
                    employee_id=id,
                    project_id=project_id,
                    hours_worked=hours_worked,
                    date=datetime.today().date()
                )
                db.session.add(work_log)
            else:
                for attr in data:
                    if attr == 'password':
                        employee.password_hash = data[attr]
                    elif hasattr(employee, attr):
                        setattr(employee, attr, data[attr])

            db.session.commit()
            return make_response(jsonify(employee.to_dict()), 200)
        else:
            return make_response({"message": "You don't have access to this page"}, 403)

    def delete(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        employee = db.session.get(Employee, id)
        if employee is None:
            return make_response(jsonify(error='Employee not found'), 404)

        work_logs = WorkLog.query.filter_by(employee_id=id).all()
        for log in work_logs:
            log.employee_id = None

        db.session.delete(employee)
        db.session.commit()
        return make_response('', 204)

api.add_resource(EmployeesById, '/employees/<int:id>')


class WorkLogs(Resource):
    def get(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user:
            return make_response({"message": "Unauthorized"}, 401)

        if user.isBoss:
            worklogs = [worklog.to_dict() for worklog in WorkLog.query.all()]
        else:
            worklogs = [worklog.to_dict() for worklog in WorkLog.query.filter_by(employee_id=user_id).all()]

        return make_response(jsonify(worklogs), 200)

    def post(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

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
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        worklog = db.session.get(WorkLog, id)
        if worklog is None:
            return make_response(jsonify(error='Worklog not found'), 404)
        return make_response(jsonify(worklog.to_dict()), 200)

    def patch(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        worklog = db.session.get(WorkLog, id)
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
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        worklog = db.session.get(WorkLog, id)
        if worklog is None:
            return make_response(jsonify(error='Worklog not found'), 404)
        db.session.delete(worklog)
        db.session.commit()
        return make_response('', 204)

api.add_resource(WorkLogByID, '/worklogs/<int:id>')

class Projects(Resource):
    def get(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        projects = [project.to_dict() for project in Project.query.all()]
        return make_response(jsonify(projects), 200)

    def post(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        data = request.get_json()
        new_project = Project(
            name=data['name'],
            location=data['location'],
            description=data['description'],
            contract_payment=data['contract_payment']
        )
        db.session.add(new_project)
        db.session.commit()
        return make_response(jsonify(new_project.to_dict()), 201)

api.add_resource(Projects, '/projects')

class ProjectsById(Resource):
    def get(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        project = db.session.get(Project, id)
        if project is None:
            return make_response(jsonify(error='Project not found'), 404)
        return make_response(jsonify(project.to_dict()), 200)

    def patch(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        project = db.session.get(Project, id)
        if project is None:
            return make_response(jsonify(error='Project not found'), 404)
        data = request.get_json()
        for attr in data:
            setattr(project, attr, data[attr])
        db.session.commit()
        return make_response(jsonify(project.to_dict()), 200)

    def delete(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        project = db.session.get(Project, id)
        if project is None:
            return make_response(jsonify(error='Project not found'), 404)
        db.session.delete(project)
        db.session.commit()
        return make_response('', 204)

api.add_resource(ProjectsById, '/projects/<int:id>')

class Expenses(Resource):
    def get(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        expenses = [expense.to_dict() for expense in Expense.query.all()]
        return make_response(jsonify(expenses), 200)

    def post(self):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

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
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        expense = db.session.get(Expense, id)
        if expense is None:
            return make_response(jsonify(error='Expense not found'), 404)
        return make_response(jsonify(expense.to_dict()), 200)

    def patch(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        expense = db.session.get(Expense, id)
        if expense is None:
            return make_response(jsonify(error='Expense not found'), 404)

        data = request.get_json()

        if 'project_id' in data:
            if data['project_id'] is not None:
                project = db.session.get(Project, data['project_id'])
                if project is None:
                    return make_response(jsonify(error='Project not found'), 404)
                expense.project = project
            else:
                expense.project = None

        for attr in data:
            if attr != 'project_id':
                setattr(expense, attr, data[attr])
        db.session.commit()
        return make_response(jsonify(expense.to_dict()), 200)

    def delete(self, id):
        user_id = session.get("employee_id")
        if not user_id:
            return make_response({"message": "Unauthorized"}, 401)

        user = db.session.get(Employee, user_id)
        if not user or not user.isBoss:
            return make_response({"message": "You don't have access to this page"}, 403)

        expense = db.session.get(Expense, id)
        if expense is None:
            return make_response(jsonify(error='Expense not found'), 404)
        db.session.delete(expense)
        db.session.commit()
        return make_response('', 204)

api.add_resource(ExpensesById, '/expenses/<int:id>')

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

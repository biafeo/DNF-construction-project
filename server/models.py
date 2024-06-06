from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import db

class Employee(db.Model, SerializerMixin):
    __tablename__ = "employees"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    address = db.Column(db.String)
    password = db.Column(db.String)
    hourly_rate = db.Column(db.Integer)
    phone_number = db.Column(db.Integer)  
    
    work_logs = relationship('WorkLog', back_populates='employee')
    
    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email
        return email
    
    serialize_rules = ('-password', '-work_logs.employee', 'work_logs')

class WorkLog(db.Model, SerializerMixin):
    __tablename__ = "work_logs"
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    hours_worked = db.Column(db.Integer)
    date = db.Column(db.Date)
    
    employee = relationship('Employee', back_populates='work_logs')
    project = relationship('Project', back_populates='work_logs')
    serialize_rules = ('-employee.work_logs', '-project.work_logs')

class Project(db.Model, SerializerMixin):
    __tablename__ = "projects"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    description = db.Column(db.String)
    
    work_logs = relationship('WorkLog', back_populates='project')
    expenses = relationship('Expense', back_populates='project')
    employees = association_proxy('work_logs', 'employee')
    
    @hybrid_property
    def total_hours(self):
        return sum(work_log.hours_worked for work_log in self.work_logs)
    
    @hybrid_property
    def total_expenses(self):
        return sum(expense.amount for expense in self.expenses)
    
    serialize_rules = ('-work_logs.project', 'work_logs', 'expenses')


class Expense(db.Model, SerializerMixin):
    __tablename__ = "expenses"
    
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    amount = db.Column(db.Integer)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    project = relationship('Project', back_populates='expenses')
    
    serialize_rules = ('-project.expenses',)

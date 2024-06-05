from app import app
from config import db
from random import randint, choice as rc
from datetime import date, time, datetime
from faker import Faker
from models import Employee, WorkLog, Expense, Project

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
    
        
                
        print("Deleting ...")
        Project.query.delete()
        db.session.commit()
        
        print("Creating projects...")
        project1 = Project(
            name="Project 1",
            location="Location 1",
            description="Description 1"
        )
        project2 = Project(
            name="Project 2",
            location="Location 2",
            description="Description 2"
        )
        db.session.add_all([project1, project2])
        db.session.commit()
        print("Projects created successfully!")

        db.create_all()

        print("Deleting employees...")
        Employee.query.delete()
        db.session.commit()
        print("Creating employees...")
        
        christopher = Employee(
            name="Christopher",
            address='chrisaddress',
            email="chrisemail@gmail.com",
            phone_number=1111111111,
            hourly_rate=50,
            password="password1"
        )
        bruno = Employee(
            name="Bruno",
            address="brunoaddress",
            email="bruno@email.com",
            phone_number=1111111112,
            hourly_rate=60,
            password="password2"
        )
        bia = Employee(
            name="Bia",
            address="biaaddress2",
            email="bia@email.com",
            phone_number=1111111113,
            hourly_rate=55,
            password="password3"
        )

        employees = [bruno, christopher, bia]
        db.session.add_all(employees)
        db.session.commit()
        print("Employees created successfully!")
        
        print("Deleting ...")
        WorkLog.query.delete()
        db.session.commit()
        print("Creating worklog...")
        
        work_logs = [
            WorkLog(
                employee_id=christopher.id,
                project_id=project1.id,
                hours_worked=5,
                date=date(2024, 6, 1)
            ),
            WorkLog(
                employee_id=bruno.id,
                project_id=project1.id,
                hours_worked=7,
                date=date(2024, 6, 2)
            ),
            WorkLog(
                employee_id=bia.id,
                project_id=project2.id,
                hours_worked=6,
                date=date(2024, 6, 3)
            ),
            WorkLog(
                employee_id=christopher.id,
                project_id=project2.id,
                hours_worked=8,
                date=date(2024, 6, 4)
            ),
            WorkLog(
                employee_id=bruno.id,
                project_id=project2.id,
                hours_worked=4,
                date=date(2024, 6, 5)
            )
        ]
        
        db.session.add_all(work_logs)
        db.session.commit()
        print("Work logs created successfully!")
        
        
        
        print("Deleting ...")
        Expense.query.delete()
        db.session.commit()
        print("Creating expenses...")
        
        expenses = [
            Expense(
                description="Materials for Project 1",
                amount=1000,
                project_id=project1.id
            ),
            Expense(
                description="Labor for Project 1",
                amount=1500,
                project_id=project1.id
            ),
            Expense(
                description="Materials for Project 2",
                amount=1200,
                project_id=project2.id
            ),
            Expense(
                description="Labor for Project 2",
                amount=1800,
                project_id=project2.id
            )
        ]
        
        db.session.add_all(expenses)
        db.session.commit()
        print("Expenses created successfully!")
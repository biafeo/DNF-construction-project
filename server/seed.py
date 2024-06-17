from app import app
from config import db
from datetime import date
from models import Employee, WorkLog, Expense, Project

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        # Create all tables
        db.create_all()

        # Deleting existing data
        print("Deleting existing data...")
        Project.query.delete()
        Employee.query.delete()
        WorkLog.query.delete()
        Expense.query.delete()
        db.session.commit()

        # Creating projects
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

        # Creating employees
        print("Creating employees...")
        christopher = Employee(
            name="Christopher",
            address='chrisaddress',
            email="chris@email.com",
            phone_number=1111111111,
            hourly_rate=50,
            isBoss = True
        )
        christopher.password_hash = "password1"
        bruno = Employee(
            name="Bruno",
            address="brunoaddress",
            email="bruno@email.com",
            phone_number=1111111112,
            hourly_rate=60
        )
        bruno.password_hash= "password2"
        bia = Employee(
            name="Bia",
            address="biaaddress2",
            email="bia@email.com",
            phone_number=1111111113,
            hourly_rate=55
        )
        bia.password_hash = "password3"
        employees = [bruno, christopher, bia]
        db.session.add_all(employees)
        db.session.commit()
        print("Employees created successfully!")

        # Creating work logs
        print("Creating work logs...")
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

        # Creating expenses
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
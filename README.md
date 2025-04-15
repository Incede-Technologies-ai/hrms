HR Management System (HRMS)
This is a full-stack HR Management System built with Java Spring Boot (Backend) and React (Frontend). The project includes:
•	Java Spring Boot backend API
•	React frontend for interacting with the backend
•	Docker configuration for easy setup and deployment
•	PostgreSQL as the database
🚀 Quick Start (Using Docker Compose)
🧑‍💻 Prerequisites
•	Docker
•	Docker Compose
________________________________________
🔧 Setup Instructions
1. Configure PostgreSQL Credentials
Open the following files and ensure the database username and password match:
•	docker-compose.yml:
•	environment:
•	  - POSTGRES_USER=your_username
•	  - POSTGRES_PASSWORD=your_password
•	incede_hrms_backend/src/main/resources/application.properties:
•	spring.datasource.username=your_username
•	spring.datasource.password=your_password


2. PostgreSQL Configuration (Docker Managed)
The Docker Compose file will automatically set up PostgreSQL with the credentials you provide.
•	Database Name: hrdb
•	Username: your configured username
•	Password: your configured password
Create database Manually 
1.	Install PostgreSQL on your machine: PostgreSQL Downloads.
2.	Create Database:
CREATE DATABASE hrdb;


4. Run the Application
Navigate to the root directory of the project (where docker-compose.yml is located), then run:
docker-compose up --build
This will:
•	Build and start the backend, frontend, and PostgreSQL containers
•	Expose the backend API on http://localhost:8080
•	Expose the frontend on http://localhost:3000
________________________________________
📦 Useful Commands
•	Start services: docker-compose up --build
________________________________________
🧱 Project Structure
/incede_hrms_backend     --> Spring Boot backend
/incede_hrms_frontend    --> React frontend
/docker-compose.yml      --> Compose file to run backend, frontend, and DB
________________________________________
🛠️ Features
•	PostgreSQL Integration
•	Leave, Asset and Employee Management
•	Dockerized Deployment
________________________________________
📫 Contact
For questions, feel free to contact [joseph.ockadan@incedetech.ai].


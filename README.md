# 💼 HR Management System (HRMS)

This is a **full-stack HR Management System** built with **Java Spring Boot** (Backend) and **React** (Frontend). It simplifies employee, leave, and asset management, and supports Docker-based deployment.

---

## 📦 Project Overview

### 💪 Tech Stack
- **Backend**: Java Spring Boot
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

---

## 🚀 Quick Start (Using Docker Compose)

### 🧑‍💻 Prerequisites
Ensure the following are installed on your system:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/download/) (installed locally to manually create the database)

---

## 🔧 Setup Instructions

### 1️⃣ Configure PostgreSQL Credentials

Ensure the same username/password are set in both of the following files:

#### 🔹 `docker-compose.yml`
```yaml
environment:
  POSTGRES_USER=your_username
  POSTGRES_PASSWORD=your_password
```

#### 🔹 `incede_hrms_backend/src/main/resources/application.properties`
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

### 📃 PostgreSQL Database Setup (Manual Step Required)

You **must create the database manually**, as the current Docker configuration does not auto-generate it.

1. **Install PostgreSQL** (if not already installed)  
   Download: https://www.postgresql.org/download/

2. **Connect to PostgreSQL**:
```bash
psql -U postgres -h localhost
```

3. **Create the database**:
```sql
CREATE DATABASE hrdb;
```

Make sure the name matches the value in your `POSTGRES_DB` and `application.properties` files.

---

### ▶️ Run the Application

From the root directory (where `docker-compose.yml` is located), run:

```bash
docker-compose up --build
```

This will:
- Build and start backend, frontend, and PostgreSQL containers
- Expose:
  - Backend API at: [http://localhost:8080](http://localhost:8080)
  - Frontend UI at: [http://localhost:3000](http://localhost:3000)

---

## 🧱 Project Structure

```
/incede_hrms_backend       --> Spring Boot backend
/incede_hrms_frontend      --> React frontend
/docker-compose.yml        --> Docker Compose setup
```

---

## 🛠️ Features

- ✅ PostgreSQL Integration
- ✅ Leave Management
- ✅ Asset Management
- ✅ Employee Management
- ✅ Dockerized Deployment

---

## 📢 Contact

For questions or feedback, feel free to reach out to:

- 📧 adarshmurali.p@incedetech.ai
- 📧 joseph.ockadan@incedetech.ai  

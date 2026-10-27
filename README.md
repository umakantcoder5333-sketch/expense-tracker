# Expense Tracker

A full-stack expense tracking application built using React, Java, Spring Boot, and MySQL.

## Overview

Expense Tracker is a project that brings together a React frontend and a Spring Boot backend, with MySQL for database management. It helped me gain practical experience in full-stack development, REST APIs, and database integration.

## Technology Stack

**Frontend**
- React
- JavaScript
- Vite
- npm

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Maven
- REST APIs
- JWT authentication components

**Database**
- MySQL

Project Structure

expense-tracker/
├── expense-tracker/                         # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/umakant/expense_tracker/
│   │   │   │   ├── config/
│   │   │   │   │   └── PasswordConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   └── ExpenseController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── ExpenseRequest.java
│   │   │   │   │   ├── ExpenseResponse.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   └── RegistrationRequest.java
│   │   │   │   ├── exception/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   ├── service/
│   │   │   │   └── ExpenseTrackerApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── .gitignore
│   ├── mvnw
│   └── mvnw.cmd
│
├── expense-tracker-frontend/                # React Frontend
│   ├── public/
│   ├── src/
│   │   └── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   ├── vite.config.js
│   └── README.md
│
├── package.json
├── package-lock.json
└── README.md

## Prequisites

. Java JDK

Node.js and npm

MySQL Server

Getting Started

1. Clone the Repository

git clone https://github.com/umakantcoder5333-sketch/expense-tracker.git
cd expense-tracker

2. Configure the Database

Create a MySQL database named expense_tracker.

Configure these environment variables for the backend:

DB_URL — MySQL connection URL

DB_USERNAME — MySQL username

DB_PASSWORD — MySQL password

JWT_SECRET — JWT secret key

Keep your credentials and secret keys private. Do not commit them to GitHub.

3. Run the Backend

Open a terminal in the backend directory:

cd expense-tracker
.\mvnw.cmd spring-boot:run

4. Run the Frontend

Open a separate terminal from the project root:

cd expense-tracker-frontend
npm install
npm run dev




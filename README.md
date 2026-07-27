# SpendWise AI

A full-stack AI-powered personal finance management platform built using the MERN stack. SpendWise AI enables users to track expenses, manage shared group expenses, receive real-time notifications, and interact with an AI financial assistant capable of analyzing spending habits and providing personalized financial insights.

---

## Table of Contents

* Overview
* Features
* Technology Stack
* Architecture
* Project Structure
* API Endpoints
* Installation
* Environment Variables
* Screenshots
* Future Enhancements
* Learning Outcomes
* Author

---

# Overview

SpendWise AI is designed to simplify personal finance management by combining traditional expense tracking with artificial intelligence and real-time communication.

The platform allows users to:

* Track daily expenses
* Categorize and analyze spending
* Manage group expenses
* Receive real-time notifications
* Upload profile images
* Chat with an AI Financial Assistant
* Receive AI-generated spending analysis and budgeting recommendations

The project demonstrates modern full-stack development practices, responsive UI design, RESTful APIs, AI integration, and real-time communication.

---

# Features

## Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Password Encryption using bcrypt
* Secure Cookie-based Authentication

---

## Dashboard

* Financial Overview
* Expense Summary
* Category-wise Analytics
* Recent Transactions
* Interactive Charts
* Responsive Dashboard Layout

---

## Expense Management

* Add Expenses
* Edit Expenses
* Delete Expenses
* Search Expenses
* Filter by Category
* Expense History
* Responsive Expense Table

---

## Group Expense Management

* Create Groups
* Add Members
* Record Shared Expenses
* Automatic Expense Splitting
* Settlement Tracking
* Group Expense History

---

## AI Financial Assistant

Powered by Google Gemini.

Features include:

* Financial Question Answering
* Expense Analysis
* Spending Pattern Insights
* Personalized Saving Suggestions
* Budget Planning
* Context-aware AI Responses
* Real-time Streaming Responses using Server-Sent Events (SSE)

---

## Real-Time Notifications

Built using Socket.IO.

Features include:

* Instant Notification Delivery
* Expense Notifications
* Group Activity Notifications
* Read / Unread Notification Management
* Live Notification Counter
* Real-time Client Updates

---

## User Profile

* Update Personal Information
* Upload Profile Picture
* Account Details
* Financial Statistics

---

# Technology Stack

## Frontend

* React
* React Router
* Tailwind CSS
* Context API
* Axios
* Lucide React
* React Icons

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Socket.IO
* bcrypt
* Multer

---

## AI

* Google Gemini API
* Prompt Engineering
* Server-Sent Events (SSE)

---

# Technical Highlights

* Full Stack MERN Architecture
* RESTful API Design
* JWT Authentication
* Cookie-based Authentication
* MVC Backend Architecture
* Context API State Management
* Real-time Notifications using Socket.IO
* Streaming AI Responses using SSE
* File Upload using Multer
* Responsive UI using Tailwind CSS
* AI Integration with Google Gemini
* Modular Component Architecture

---

# System Architecture

```text
                    React Frontend
                           │
            REST API       │      Socket.IO
                           │
                  Express.js Backend
                  │                │
                  │                │
              MongoDB         Gemini API
                  │
             Application Data
```

---

# Project Structure

```text
SpendWise-AI
│
├── client
│   ├── src
│   │
│   ├── assets
│   ├── components
│   ├── context
│   ├── layouts
│   ├── pages
│   ├── services
│   ├── hooks
│   ├── utils
│   └── App.jsx
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── uploads
│   ├── utils
│   ├── socket
│   └── server.js
│
├── README.md
│
└── package.json
```

---

# REST API

## Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/upload-profile
```

---

## Expenses

```http
GET     /api/expenses
POST    /api/expenses
PUT     /api/expenses/:id
DELETE  /api/expenses/:id
```

---

## Groups

```http
GET     /api/groups
POST    /api/groups
GET     /api/groups/:id
PUT     /api/groups/:id
DELETE  /api/groups/:id
```

---

## AI

```http
POST /api/ai/chat
POST /api/ai/chat/stream
POST /api/ai/analyze
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/your-username/spendwise-ai.git
```

Backend

```bash
cd server
npm install
npm run dev
```

Frontend

```bash
cd client
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

#

# Future Enhancements

* AI-powered Expense Forecasting
* OCR Receipt Scanner
* Voice-enabled AI Assistant
* Financial Goal Tracking
* Monthly Expense Reports
* Export Reports as PDF
* Export Reports as Excel
* Multi-currency Support
* Dark Mode
* AI Investment Suggestions
* Email Notifications
* Progressive Web App (PWA)
* Mobile Application

---

# Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack MERN Development
* REST API Development
* MongoDB Data Modeling
* JWT Authentication
* Cookie-based Authentication
* Context API State Management
* File Upload Handling with Multer
* AI Integration using Google Gemini
* Prompt Engineering
* Server-Sent Events (SSE)
* Socket.IO Real-time Communication
* Event-driven Programming
* Responsive Web Design
* Tailwind CSS
* Component-based Architecture
* MVC Design Pattern
* Error Handling
* Secure Backend Development

---

# Author

**Shreya Mittal**

Full Stack MERN Developer

GitHub: https://github.com/shreyamittal239

---

# License

This project is developed for learning, portfolio, and demonstration purposes.


###---

# 📝 Event Registration App (MERN Stack)

This is a full-stack **Event Registration Application** built with the **MERN stack** – **MongoDB, Express.js, React.js, and Node.js**. The app allows users to register for events by submitting their details through a frontend form, which is stored securely in a MongoDB database.

## 🚀 Features

* User-friendly registration form with React
* Backend API built with Express & Node.js
* Stores user registration data in MongoDB
* Form validation on both frontend and backend
* Confirmation message upon successful registration
* RESTful API with structured error handling

## 🛠️ Tech Stack

* **Frontend**: React, Axios, Tailwind CSS / CSS Modules
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Tools**: Git, GitHub, Postman, VS Code

## 📁 Project Structure

```
/client     → React frontend (event form)
/server     → Node.js + Express backend API
└── models  → Mongoose schemas
└── routes  → API routes for registration
```

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/event-registration.git
cd event-registration-app
```

### 2. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 3. Create `.env` in `/server`

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run the application

```bash
# Run backend
cd server
npm start

# Run frontend
cd ../client
npm start
```

## 💡 Learning Outcome

This project helped me:

* Build and connect a full MERN stack app
* Understand form handling and state management in React
* Create and consume RESTful APIs
* Implement validation and error handling
* Work with MongoDB using Mongoose for data storage

## 📦 Future Improvements

* Admin panel to view all registrations
* Email confirmation system
* Authentication for event organizers

## 🔗 GitHub Repository

[https://github.com/ErAdilrasheed/event-registration]

---

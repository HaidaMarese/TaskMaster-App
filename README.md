# TaskMaster Backend API

TaskMaster is a secure RESTful API for managing users, projects, and tasks. It powers a productivity application tailored for individuals and small teams.

---

##  Overview

This API provides:

-  **User Authentication**
  - Register and login with JWT
  - Passwords hashed using bcrypt
-  **Project Management**
  - CRUD operations
  - Ownership-based access
-  **Task Management**
  - Nested tasks under projects
  - Secure, role-based authorization

Built using **Node.js**, **Express**, **MongoDB**, **Mongoose**, **JWT**, and **bcrypt**.

---

##  Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT + bcrypt  
- **Environment Config**: dotenv  

---

##  Project Structure





---

##  API Endpoints

###  User Routes
- `POST /api/users/register` → Register new user  
- `POST /api/users/login` → Authenticate user & get token  

###  Project Routes 
- `GET /api/projects` → Get all user projects  
- `POST /api/projects` → Create new project  
- `GET /api/projects/:id` → Get single project  
- `PUT /api/projects/:id` → Update project  
- `DELETE /api/projects/:id` → Delete project  

###  Task Routes (Protected & Nested)
- `POST /api/projects/:projectId/tasks` → Add task to project  
- `GET /api/projects/:projectId/tasks` → Get all tasks in project  
- `PUT /api/tasks/:taskId` → Update task  
- `DELETE /api/tasks/:taskId` → Delete task  

---

##  Clone Repo


   ```bash
   git clone https://github.com/HaidaMarese/TaskMaster-App.git
 ```

##  Install Dependencies

- npm install
- Create .env File

- .env

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

##  Testing
- Use Postman or Insomnia to test all routes.
- Include token in headers:Authorization: Bearer <your-token>

##  Author

Haida Makouangou  
Backend Developer | UNCC & Per Scholas  








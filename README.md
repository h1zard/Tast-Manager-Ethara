# 🚀 Team Task Manager

A production-ready task management web application built with **Node.js, Express, MongoDB, Mongoose, JWT authentication, and EJS server-side rendering**.

---

## 🌍 Live Demo

🔗 https://team-task-manager-production-c47b.up.railway.app


---

## 📌 Features

* 🔐 User Signup & Login (JWT + Cookies)
* 👥 Role-Based Access Control (Admin / Member)
* 📁 Admin-only Project Creation & Team Management
* ✅ Task Assignment & Status Updates
* 📊 Dashboard with Task Summary
* ⏰ Overdue Task Highlighting
* ☁️ Fully deployed on cloud

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (MongoDB Atlas)
* **Frontend:** EJS, HTML, CSS
* **Authentication:** JWT + Cookies
* **Deployment:** Railway

---

## 📁 Folder Structure

```
models/
controllers/
routes/
middleware/
views/
public/css/
app.js
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env id="env01"
MONGO_URI=mongodb+srv://abhijklmnosingh_db_user:<db_password>@cluster0.cqhxvuq.mongodb.net/?appName=Cluster0
JWT_SECRET=your_secret_key
COOKIE_NAME=token
NODE_ENV=development
PORT=3000
```

For production (Railway), configure:

* `MONGO_URI`
* `JWT_SECRET`
* `COOKIE_NAME`
* `NODE_ENV=production`

---

## 🧪 Setup & Run Locally

### 1. Install dependencies

```bash id="cmd01"
npm install
```

### 2. Start the server

```bash id="cmd02"
npm start
```

### 3. Open browser

```
http://localhost:3000/login
```

---

## 🚂 Deployment (Railway)

This application is deployed using Railway with:

* Dynamic port handling:

```js id="code01"
const PORT = process.env.PORT || 8080;
```

* Server binding:

```js id="code02"
app.listen(PORT, '0.0.0.0');
```

* Cloud database via MongoDB Atlas

---

## 🚀 Future Improvements

* 📱 Mobile responsive UI
* 🔔 Notifications system
* 📊 Advanced analytics dashboard
* 🌐 Custom domain
* 🧑‍🤝‍🧑 Real-time collaboration

---

## 👨‍💻 Author

**Abhishek Singh**

* GitHub: https://github.com/abhisingh003

---

<div align="right">

### ✨ Made by Abhishek Singh

</div>

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

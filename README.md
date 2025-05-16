# Kim Chat

**Kim Chat** is a real-time chat application designed for fast, lightweight, and responsive communication—similar to WhatsApp or Discord. Built with **React**, **Node.js**, **Express**, **Socket.io**, and **MongoDB**, it supports private and group messaging, real-time updates, and modern UI/UX.

---
---



## 📌 Features

- ✅ Real-time chat using WebSockets (Socket.io)
- ✅ User authentication (login & signup)
- ✅ Private and group messaging
- ✅ Responsive UI across devices
- ✅ Scalable architecture with MongoDB for storage
- ✅ Built with a modern MERN stack

---

## 🛠️ Tech Stack

| Layer        | Technology       |
|--------------|------------------|
| Frontend     | React, Vite      |
| Backend      | Node.js, Express |
| Real-time    | Socket.io        |
| Database     | MongoDB (Mongoose) |
| Styling      | CSS Modules / Tailwind |

---
---





# 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or above)
- npm 
- MongoDB (local or cloud instance)



## 1.📂 Clone the Repository

```bash
git clone https://github.com/frustateduser/kim_chat.git
cd kim_chat
```



## 2.🔧 Backend Setup

```bash
cd kim_chat_backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT = 3000
MONGO_URI = mongodb://localhost:27017/kim_chat
JWT_SECRET = @KIM_chat.secret-k3y
CLIENT_URL = http://localhost:5173
```

Start the backend server:

```bash
npm start
```

---

## 3.🎨 Frontend Setup

```bash
cd ../kim_chat_frontend
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_REACT_APP_SIGNUP_API_URL=http://localhost:3000/api/auth/signup
VITE_REACT_APP_LOGIN_API_URL=http://localhost:3000/api/auth/login
VITE_REACT_APP_PROFILE_API_URL=http://localhost:3000/api/user/profile
VITE_REACT_APP_FETCH_CHATS_API_URL=http://localhost:3000/api/chat/users/
VITE_REACT_APP_SEARCH_USER_API_URL=http://localhost:3000/api/chat/search
VITE_REACT_APP_FETCH_CONVERSATION_API_URL=http://localhost:3000/api/chat/history/
VITE_REACT_APP_BACKEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

Open the app in the browser:

```
http://localhost:5173/
```

---
---


# 📁 Project Structure


```
kim_chat/
├── kim_chat_backend/
|   ├── node_modules/
|   ├── src/
|   |   ├── config/
│   |   ├── controllers/
|   |   ├── middleware/
│   |   ├── routes/
│   |   ├── models/
|   |   ├── socket/
│   |   └── server.js
|   ├── .env
|   ├── .gitignore
|   ├── package-lock.json
|   ├── package.json
|   └── README.md
|
├── kim_chat_frontend/
|   ├── node_modules/
|   ├── public/ 
|   ├── src/  
|   |   ├── api/
|   |   ├── assets/
|   |   ├── components/
|   |   ├── pages/
|   |   ├── style/
|   |   ├── index.css
|   |   └── main.jsx
|   ├── .env
|   ├── .gitignore
|   ├── eslint.config.js
|   ├── index.html
|   ├── package-lock.json
|   ├── package.json
|   ├── README.md
|   └── vite.config.js
├── .gitattribute
└── README.md

```

---
---

## 🧪 Future Enhancements

- ✅ Add message persistence and history
- ✅ Show online/offline user status
- ✅ Media and file sharing
- ✅ Read receipts & typing indicators
- ✅ Dark/light theme toggle
- ✅ Unit and integration testing
- ✅ Audio and Video Chat
- ✅ Group Chats

---

## 🧑‍💻 Contributing

Contributions are welcome! See [Contribution guidelines](https://github.com/frustateduser/kim_chat/blob/master/CONTRIBUTING.md) for more info

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Inspired by modern chat platforms like Discord and WhatsApp. Built for learning, experimentation, and real-world deployment.

---

## 🔗 Contact

For questions or feedback, open an issue or reach out via GitHub.

---

## Running Workflows Locally

Before pushing your changes to a GitHub remote branch, it is recommended to run all workflows locally to ensure everything works as expected.

### Steps to Run Workflows Locally

1. **Install Dependencies**:
   - Navigate to the respective directories and install the required dependencies:
     ```powershell
     cd kim_chat_frontend
     npm install

     cd ../kim_chat_backend
     npm install
     ```

2. **Run ESLint Workflow**:
   - For the frontend:
     ```powershell
     cd kim_chat_frontend
     npx eslint . --ext .js,.jsx,.ts,.tsx
     ```
   - For the backend:
     ```powershell
     cd ../kim_chat_backend
     npx eslint . --ext .js
     ```

3. **Run Tests (if applicable)**:
   - If your project includes tests, run them locally:
     ```powershell
     npm test
     ```

4. **Build the Project**:
   - Ensure the project builds successfully:
     ```powershell
     cd kim_chat_frontend
     npm run build

     cd ../kim_chat_backend
     npm run build
     ```

5. **Verify Other Workflows**:
   - If there are additional workflows, follow their specific instructions to run them locally.

By following these steps, you can ensure that your changes are ready for submission and meet the project's quality standards.

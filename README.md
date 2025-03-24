Copy

# Ecodeed - Environmental Blog

Welcome to **Ecodeed**, an environmental blog where you can stay updated on environmental news, policies, politics, and more. This is my first blog application, and I’m excited to share it with you!

---

## Project Structure

The project is structured as a MERN (MongoDB, Express, React, Node.js) stack application. Below is the detailed file structure:

mern-blog/
│
├── api/ # Backend
│ ├── controllers/ # Handles business logic
│ │ ├── auth.controller.js
│ │ ├── comment.controller.js
│ │ ├── post.controller.js
│ │ └── user.controller.js
│ │
│ ├── models/ # Mongoose schemas
│ │ ├── comment.model.js
│ │ ├── post.model.js
│ │ └── user.model.js
│ │
│ ├── routes/ # API routes
│ │ ├── auth.route.js
│ │ ├── comment.route.js
│ │ ├── post.route.js
│ │ ├── user.route.js
│ │ └── upload.js
│ │
│ ├── utils/ # Utility functions
│ │ ├── cloudinaryConfig.js
│ │ ├── error.js
│ │ └── verifyUser.js
│ │
│ ├── cloudinarytest.js # Testing Cloudinary configuration
│ ├── index.js # Entry point for the backend server
│ └── .env # Environment variables
│
├── client/ # Frontend
│ ├── node_modules/ # Dependencies
│ ├── public/ # Public files (if applicable)
│ ├── src/ # React source code
│ │ ├── components/ # Reusable React components
│ │ │ ├── CallToAction.jsx
│ │ │ ├── Comments.jsx
│ │ │ ├── CommentSection.jsx
│ │ │ ├── DashboardComponent.jsx
│ │ │ ├── DashComments.jsx
│ │ │ ├── DashPosts.jsx
│ │ │ ├── DashProfile.jsx
│ │ │ ├── DashSidebar.jsx
│ │ │ ├── DashUsers.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Header.jsx
│ │ │ ├── OAuth.jsx
│ │ │ ├── OnlyAdminPrivateRoute.jsx
│ │ │ ├── PostCard.jsx
│ │ │ ├── PrivateRoute.jsx
│ │ │ ├── ScrollToTop.jsx
│ │ │ └── ThemeProvider.jsx
│ │ │
│ │ ├── pages/ # Page-level React components
│ │ │ ├── About.jsx
│ │ │ ├── CreatePost.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── PostPage.jsx
│ │ │ ├── Projects.jsx
│ │ │ ├── Search.jsx
│ │ │ ├── SignIn.jsx
│ │ │ └── SignUp.jsx
│ │ │
│ │ ├── redux/ # Redux state management
│ │ │ ├── store.js
│ │ │ ├── theme/ # Redux slice for theme
│ │ │ │ └── themeSlice.js
│ │ │ └── user/ # Redux slice for user
│ │ │ └── userSlice.js
│ │ │
│ │ ├── utils/ # Utility functions
│ │ │ └── cloudinary.js
│ │ │
│ │ ├── App.jsx # Main React component
│ │ ├── firebase.js # Firebase configuration (if applicable)
│ │ ├── index.css # Global CSS
│ │ ├── main.jsx # React entry point
│ │
│ ├── .env # Environment variables for the frontend
│ ├── eslint.config.js # ESLint configuration
│ ├── index.html # HTML entry point
│ ├── package.json # Frontend dependencies
│ ├── postcss.config.js # PostCSS configuration
│ ├── tailwind.config.js # Tailwind CSS configuration
│ └── vite.config.js # Vite configuration
│
├── node_modules/ # Root dependencies for the entire project
├── .env # Root environment variables
├── .gitignore # Git ignore file
├── package.json # Root dependencies
├── README.md # Project documentation
└── package-lock.json # Dependency lock file
Copy


---

## Features

- **Backend (API)**:
  - User authentication and authorization.
  - CRUD operations for posts and comments.
  - Integration with Cloudinary for image uploads.
  - Environment variable management using `.env`.

- **Frontend (Client)**:
  - Responsive design with Tailwind CSS.
  - State management using Redux.
  - Reusable React components for scalability.
  - Pages for creating, viewing, and searching posts.
  - User authentication (sign-in, sign-up, OAuth).

---

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS, Vite.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Authentication**: Firebase, OAuth.
- **Image Storage**: Cloudinary.
- **State Management**: Redux Toolkit.
- **Styling**: Tailwind CSS, PostCSS.

---

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Ecodeed.git

    Navigate to the project directory:
    bash
    Copy

    cd mern-blog

    Install dependencies for both backend and frontend:
    bash
    Copy

    npm install
    cd client
    npm install

    Set up environment variables:

        Create a .env file in the api/ directory and add your MongoDB URI, Cloudinary credentials, etc.

        Create a .env file in the client/ directory for frontend-specific environment variables.

    Start the backend server:
    bash
    Copy

    cd api
    npm start

    Start the frontend development server:
    bash
    Copy

    cd client
    npm run dev

    Open your browser and visit http://localhost:3000 to view the application.

Contributing

Contributions are welcome! If you’d like to contribute, please follow these steps:

    Fork the repository.

    Create a new branch for your feature or bugfix.

    Commit your changes.

    Submit a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.
Contact

If you have any questions or suggestions, feel free to reach out:

    Email: gikonyo.mwema@gmail.com

    GitHub: gikonyo-mwema

Thank you for visiting Ecodeed! Let’s work together to make the world a greener place. 🌍

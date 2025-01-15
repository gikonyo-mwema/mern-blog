Hello, this is the first blog application I am working on. Prepare to be amazed!


file structure 

mern-blog/
│
├── api/                          # Backend
│   ├── controllers/              # Handles business logic
│   │   ├── auth.controller.js
│   │   ├── comment.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   │
│   ├── models/                   # Mongoose schemas
│   │   ├── comment.model.js
│   │   ├── post.model.js
│   │   └── user.model.js
│   │
│   ├── routes/                   # API routes
│   │   ├── auth.route.js
│   │   ├── comment.route.js
│   │   ├── post.route.js
│   │   ├── user.route.js
│   │   └── upload.js
│   │
│   ├── utils/                    # Utility functions
│   │   ├── cloudinaryConfig.js
│   │   ├── error.js
│   │   └── verifyUser.js
│   │
│   ├── cloudinarytest.js         # Testing cloudinary configuration
│   ├── index.js                  # Entry point for the backend server
│   └── .env                      # Environment variables
│
├── client/                       # Frontend
│   ├── node_modules/             # Dependencies
│   ├── public/                   # Public files (if applicable)
│   ├── src/                      # React source code
│   │   ├── components/           # Reusable React components
│   │   │   ├── CallToAction.jsx
│   │   │   ├── Comments.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── DashboardComponent.jsx
│   │   │   ├── DashComments.jsx
│   │   │   ├── DashPosts.jsx
│   │   │   ├── DashProfile.jsx
│   │   │   ├── DashSidebar.jsx
│   │   │   ├── DashUsers.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── OAuth.jsx
│   │   │   ├── OnlyAdminPrivateRoute.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── ThemeProvider.jsx
│   │   │
│   │   ├── pages/                # Page-level React components
│   │   │   ├── About.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── PostPage.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   │
│   │   ├── redux/                # Redux state management
│   │   │   ├── store.js
│   │   │   ├── theme/            # Redux slice for theme
│   │   │   │   └── themeSlice.js
│   │   │   └── user/             # Redux slice for user
│   │   │       └── userSlice.js
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   └── cloudinary.js
│   │   │
│   │   ├── App.jsx               # Main React component
│   │   ├── firebase.js           # Firebase configuration (if applicable)
│   │   ├── index.css             # Global CSS
│   │   ├── main.jsx              # React entry point
│   │
│   ├── .env                      # Environment variables for the frontend
│   ├── eslint.config.js          # ESLint configuration
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── vite.config.js            # Vite configuration
│
├── node_modules/                 # Root dependencies for the entire project
├── .env                          # Root environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Root dependencies
├── README.md                     # Project documentation
└── package-lock.json             # Dependency lock file

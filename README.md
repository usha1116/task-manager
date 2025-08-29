# TaskFlow - MERN Stack Task Manager

A modern, full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring authentication, role-based permissions, and a beautiful responsive UI.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication with http-only cookies
  - Role-based access control (Admin/Member)
  - Secure password hashing with bcrypt

- **Task Management**
  - Create, read, update, and delete tasks
  - Task assignment and status tracking
  - Priority levels and due dates
  - Tag-based organization

- **User Management (Admin)**
  - User registration and management
  - Role assignment and status control
  - User statistics and activity tracking

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Dark/Light theme toggle
  - Real-time notifications with react-hot-toast
  - Beautiful animations and transitions

- **Advanced Features**
  - Pagination and filtering
  - Search functionality
  - Statistics and analytics
  - Profile management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Task Manager
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start the server (from server directory)
   cd server
   npm start

   # Start the client (from client directory)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment**
   - Ensure all environment variables are set
   - Update CORS settings for production
   - Set `NODE_ENV=production`

2. **Deploy to your preferred platform**
   - **Render**: Connect your GitHub repo and set build command: `npm install`
   - **Railway**: Connect your GitHub repo
   - **Heroku**: Use Heroku CLI or GitHub integration

### Frontend Deployment (Vercel)

1. **Prepare for Vercel deployment**
   - Update API base URL in `client/src/utils/api.js`
   - Set environment variables in Vercel dashboard

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from client directory
   cd client
   vercel
   ```

3. **Environment Variables in Vercel**
   - Go to your Vercel project dashboard
   - Add environment variables:
     - `REACT_APP_API_URL`: Your backend API URL

## 📁 Project Structure

```
Task Manager/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

**Client (Vercel Environment Variables)**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Database Setup

1. **Local MongoDB**
   ```bash
   # Install MongoDB locally
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string
   - Update `MONGODB_URI` in environment variables

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PATCH /api/auth/password` - Change password

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination/filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Statistics
- `GET /api/stats/overview` - Get overview statistics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling
- [Lucide React](https://lucide.dev/) for the amazing icons
- [React Hot Toast](https://react-hot-toast.com/) for notifications
- [Date-fns](https://date-fns.org/) for date utilities

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Coding! 🎉**
=======
# task-manager
>>>>>>> 59ee46ae9b0add324186cdec1e9fc0393daa92fc

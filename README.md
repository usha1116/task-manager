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

>>>>>>> 59ee46ae9b0add324186cdec1e9fc0393daa92fc

# College Job Portal - MERN Stack Application

A comprehensive job portal application built exclusively for college students and alumni using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Features

### 🔐 Authentication & Authorization
- **College Email Restriction**: Only users with college email domain can register
- **Role-Based Access**: Students and Alumni roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Profile Management**: Comprehensive user profiles with skills, experience, etc.

### 💼 Job Management
- **Job Posting**: Both students and alumni can post job opportunities
- **Advanced Search**: Search by keywords, job type, experience level, and poster role
- **Job Applications**: Apply for jobs with application tracking
- **Application Management**: Job posters can manage applications and update status

### 🎓 College Community Focus
- **Student/Alumni Network**: Connect within your college community
- **Role Indicators**: Clear identification of student vs alumni posts
- **Graduation Year Tracking**: Alumni profiles include graduation year
- **Major/Field Tracking**: Connect with people in similar fields

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user actions
- **Loading States**: Smooth loading indicators throughout the app

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Icon library
- **React Hot Toast** - Notification system

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-job-portal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Copy environment variables and configure
   cp .env.example .env
   # Edit .env with your database URL and other settings

   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install

   # Copy environment variables
   cp .env.example .env
   # Edit .env with your API URL

   # Start frontend development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/college-job-portal

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# College domain restriction
COLLEGE_EMAIL_DOMAIN=@college.edu

# Server
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_COLLEGE_NAME=Your College Name
REACT_APP_COLLEGE_DOMAIN=@college.edu
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Users
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/my-jobs` - Get user's posted jobs
- `POST /api/users/apply/:jobId` - Apply for job
- `GET /api/users/my-applications` - Get user's applications
- `PUT /api/users/application-status/:jobId/:userId` - Update application status

## Project Structure

```
college-job-portal/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── JobCard.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── JobsPage.js
│   │   │   ├── JobDetailsPage.js
│   │   │   ├── CreateJobPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── MyJobsPage.js
│   │   │   └── MyApplicationsPage.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## Key Features Explained

### College Email Validation
The application restricts registration to users with specific college email domains. This is configured in the `COLLEGE_EMAIL_DOMAIN` environment variable and enforced both on the frontend and backend.

### Role-Based System
- **Students**: Can post internships, part-time jobs, and entry-level positions
- **Alumni**: Can post all types of jobs and referrals from their companies
- Both roles can apply for jobs and view all listings

### Job Application Flow
1. Users browse jobs with filtering capabilities
2. Click on job details to view full information
3. Apply directly through the platform
4. Job posters receive applications and can update status
5. Applicants can track their application status

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet

## Development

### Running in Development Mode
```bash
# Backend (runs on port 5000)
cd backend
npm run dev

# Frontend (runs on port 3000)
cd frontend
npm start
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (set NODE_ENV=production in .env)
cd backend
npm start
```

## Customization

### College Branding
1. Update `REACT_APP_COLLEGE_NAME` in frontend `.env`
2. Replace logo and favicon in `public/` folder
3. Modify color scheme in `tailwind.config.js`
4. Update college domain in `COLLEGE_EMAIL_DOMAIN`

### Email Domain Restriction
To change the allowed email domain:
1. Update `COLLEGE_EMAIL_DOMAIN` in backend `.env`
2. Update `REACT_APP_COLLEGE_DOMAIN` in frontend `.env`
3. Restart both servers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact [your-email@college.edu] or create an issue in the repository.

---

**Note**: This application is designed specifically for college communities. Make sure to configure the college email domain and branding before deployment.

# Money Transfer Application

A modern, full-stack digital wallet application built with Next.js 14, TypeScript, and Node.js. This application allows users to securely send and receive money with a beautiful, responsive interface.

## 🚀 Features

- User authentication (Sign up, Sign in)
- Secure money transfers between users
- Real-time balance updates
- Profile management
- Responsive design
- JWT-based authentication
- RESTful API architecture

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Hook Form
- Zod Validation

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- CORS enabled
- Zod for validation

## 🏗️ Project Structure

```
money-transfer/
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   └── lib/             # Utility functions and validations
│
└── backend/              # Express.js backend application
    ├── src/             # Source code
    │   ├── routes/      # API routes
    │   └── lib/         # Utilities and middleware
    └── dist/            # Compiled TypeScript
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance running
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Abhayaj247/MoneyTransfer.git
cd money-transfer
```

2. Install Backend Dependencies:
```bash
cd backend
npm install
```

3. Install Frontend Dependencies:
```bash
cd frontend
npm install
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the Application

1. Start the Backend:
```bash
cd backend
npm run dev
```

2. Start the Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## 📝 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Register a new user
- `POST /api/v1/user/signin` - Login user
- `GET /api/v1/user/me` - Get current user information

### Account
- `GET /api/v1/account/balance` - Get user balance
- `POST /api/v1/account/transfer` - Transfer money

## 🚀 Deployment

### Backend
- Deployed on Render
- URL: https://moneytransfer-xwjg.onrender.com

### Frontend
- Deployed on Vercel
- URL: https://money-transfer-five.vercel.app

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Abhay Joshi
- GitHub: [@Abhayaj247](https://github.com/Abhayaj247)
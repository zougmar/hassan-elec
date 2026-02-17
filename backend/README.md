# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hassan-elec
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
ADMIN_EMAIL=admin@hassan-elec.com
ADMIN_PASSWORD=admin123
```

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Run Production Server

```bash
npm start
```

## Default Admin Credentials

- Email: admin@hassan-elec.com
- Password: admin123

⚠️ Change these after first login!

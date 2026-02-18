# Hassan Electrician Service - MERN Stack Application

A complete professional MERN stack web application for an electrician service business with multi-language support (English, French, Arabic) and fully responsive design.

## Features

- 🌐 **Multi-language Support**: English, French, and Arabic with RTL layout support
- 📱 **Fully Responsive**: Mobile-first design for all devices
- 🔐 **Admin Dashboard**: Complete CRUD operations for services, projects, and requests
- 📸 **Image Upload**: Support for image uploads (local storage)
- 💬 **WhatsApp Integration**: Floating WhatsApp button for quick contact
- 🎨 **Modern UI**: Built with Tailwind CSS and Lucide Icons
- 🔒 **JWT Authentication**: Secure admin authentication
- 📊 **Statistics Dashboard**: View request statistics

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- i18next (Internationalization)
- Axios
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)

## Project Structure

```
hassan-elec/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload middleware
│   ├── utils/           # Utility functions
│   ├── uploads/        # Uploaded files
│   ├── server.js        # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── context/     # Auth context
    │   ├── i18n/        # Translation files
    │   ├── utils/       # API utilities
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hassan-elec
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
ADMIN_EMAIL=admin@hassan-elec.com
ADMIN_PASSWORD=admin123
```

4. Create `uploads` directory:
```bash
mkdir uploads
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=+1234567890
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Email**: admin@hassan-elec.com
- **Password**: admin123

⚠️ **Important**: Change these credentials after first login in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (Protected)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (Protected)
- `PUT /api/services/:id` - Update service (Protected)
- `DELETE /api/services/:id` - Delete service (Protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Requests
- `GET /api/requests` - Get all requests (Protected)
- `GET /api/requests/stats` - Get request statistics (Protected)
- `GET /api/requests/:id` - Get single request (Protected)
- `POST /api/requests` - Create request (Public)
- `PUT /api/requests/:id` - Update request status (Protected)
- `DELETE /api/requests/:id` - Delete request (Protected)

## Usage

### Adding Services
1. Login to admin dashboard at `/admin/login`
2. Navigate to Services section
3. Click "Add New" button
4. Fill in title and description in all three languages (EN, FR, AR)
5. Upload an image (optional)
6. Set display order
7. Save

### Adding Projects
1. Go to Projects section in admin dashboard
2. Click "Add New"
3. Fill in project details in all languages
4. Upload multiple images
5. Set category
6. Save

### Managing Requests
1. Go to Requests section
2. View all client requests
3. Update status (Pending → In Progress → Done)
4. View details by clicking the eye icon
5. Delete requests if needed

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `UPLOAD_PATH` - Path for uploaded files
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password
- **Cloudinary (recommended for Vercel/production)** – so uploaded images persist (no disappearing after refresh):
  - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
  - `CLOUDINARY_API_KEY` - Cloudinary API key
  - `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_WHATSAPP_NUMBER` - WhatsApp number for contact button
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

## Features in Detail

### Multi-language Support
- Language switcher in navbar
- All content translated in EN, FR, AR
- RTL layout automatically applied for Arabic
- Language preference saved in localStorage

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Collapsible sidebar in admin dashboard
- Responsive cards and grids
- Touch-friendly interface

### Image Handling
- Local file uploads stored in `backend/uploads` (or `/tmp` on Vercel without Cloudinary)
- **Production (Vercel):** Set Cloudinary env vars so images are stored in the cloud and persist after refresh
- Image preview before upload
- Multiple images for projects
- Automatic image serving via Express static middleware (or Cloudinary URLs when configured)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, update connection string

### Image Upload Issues
- Ensure `uploads` directory exists in backend
- Check file permissions
- Verify file size (max 5MB)

### CORS Errors
- Backend CORS is configured for all origins
- For production, update CORS settings in `server.js`

## License

This project is open source and available for use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

Built with ❤️ using MERN Stack

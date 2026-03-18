# Travel Planner Backend

Complete backend API for the Travel Planner application built with Node.js, Express, and MongoDB.

## 📋 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Trip Management (Create, Read, Update, Delete trips)
- ✅ Activity Management (Add/edit activities to trips)
- ✅ Places Directory (Browse, search, filter places)
- ✅ Saved Places (Bookmark favorite locations)
- ✅ User Profiles (Update preferences and profile info)
- ✅ AI Recommendations (Get personalized travel suggestions)

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator
- **CORS:** Enabled for frontend integration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Update `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travel-planner
   JWT_SECRET=your-super-secret-key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **For MongoDB Atlas (Cloud):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-planner
   ```

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run at: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)
- `PUT /api/auth/profile` - Update profile (requires token)

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/activities` - Add activity to trip
- `PUT /api/trips/:id/activities/:activityId` - Update activity
- `DELETE /api/trips/:id/activities/:activityId` - Delete activity

### Places
- `GET /api/places` - Get all places (with filters)
- `GET /api/places/:id` - Get place details
- `GET /api/places/search?q=query` - Search places
- `POST /api/places` - Create place (admin)
- `POST /api/places/save` - Save place to bookmarks
- `GET /api/places/saved` - Get saved places
- `DELETE /api/places/saved/:placeId` - Unsave place

### Recommendations
- `POST /api/recommendations` - Get AI recommendations (requires token)

### Health Check
- `GET /api/health` - Server status

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── tripController.js     # Trip logic
│   ├── placeController.js    # Place logic
│   └── recommendationController.js
├── middleware/
│   └── auth.js              # JWT verification
├── models/
│   ├── User.js              # User schema
│   ├── Trip.js              # Trip schema
│   ├── Place.js             # Place schema
│   └── SavedPlace.js        # SavedPlace schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── tripRoutes.js        # Trip endpoints
│   ├── placeRoutes.js       # Place endpoints
│   └── recommendationRoutes.js
├── server.js                 # Main Express app
├── .env                      # Environment variables (not committed)
└── package.json              # Dependencies
```

## 🔄 Frontend Integration

Your React frontend should:

1. **Login/Register:**
   ```js
   const response = await fetch('http://localhost:5000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   })
   const data = await response.json()
   localStorage.setItem('token', data.token)
   ```

2. **Make Authenticated Requests:**
   ```js
   const token = localStorage.getItem('token')
   const response = await fetch('http://localhost:5000/api/trips', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

## 📝 Sample Data Setup

To populate MongoDB with sample places, run:
```bash
# Create a seed file and execute it
node scripts/seedPlaces.js
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongoServerError: connect ECONNREFUSED` | Ensure MongoDB is running locally or update MONGODB_URI |
| `CORS error from frontend` | Check FRONTEND_URL in .env matches your React dev server |
| `Invalid token error` | Token may be expired. User needs to login again |
| `Port 5000 already in use` | Change PORT in .env or kill process: `lsof -ti:5000` |

## 📚 Next Steps

1. Add seed data for places
2. Integrate with real AI service (OpenAI API) for recommendations
3. Add email verification for registration
4. Add file upload for profile images
5. Add real-time notifications with Socket.io
6. Deploy to production (Heroku, Railway, Render, etc.)

## 📄 License

MIT

---

**Need Help?** Check the API documentation or contact the development team.

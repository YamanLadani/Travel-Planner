# 🚀 Quick Start Guide - Travel Planner Backend

## Step 1: Install Node.js
Download and install from: https://nodejs.org/

## Step 2: Install MongoDB
Choose one:
- **Local:** https://www.mongodb.com/try/download/community
- **Cloud (Easy):** https://www.mongodb.com/cloud/atlas (Free tier available)

## Step 3: Clone & Setup Backend
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

## Step 4: Configure .env
Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-planner
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

For MongoDB Atlas cloud:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-planner
```

## Step 5: Seed Sample Data
```bash
node scripts/seedPlaces.js
```

Expected output:
```
✓ Connected to MongoDB
✓ Cleared existing places
✓ Inserted 8 places
✓ Database connection closed
```

## Step 6: Start the Server
```bash
npm run dev
```

Expected output:
```
✓ Server running at http://localhost:5000
✓ CORS enabled for: http://localhost:5173
```

## Step 7: Test the Backend
Open in browser: `http://localhost:5000/api/health`

Should return:
```json
{
  "message": "Server is running"
}
```

## Step 8: Update Frontend
In your React app, update API calls to:
```javascript
const API_URL = 'http://localhost:5000/api'

// Example: Login
const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}

// Example: Get trips (with token)
const getTrips = async (token) => {
  const response = await fetch(`${API_URL}/trips`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return response.json()
}
```

## 🎯 Running Both Frontend & Backend

**Terminal 1 - Frontend:**
```bash
cd travel-planner  # or your frontend folder
npm run dev
```
Runs at: `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Runs at: `http://localhost:5000`

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (local or cloud)
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Sample data seeded (`npm run scripts/seedPlaces.js`)
- [ ] Server running (`npm run dev`)
- [ ] Health check working (`http://localhost:5000/api/health`)
- [ ] Frontend configured to use `http://localhost:5000/api`

## 🔧 Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# View MongoDB connections (if running locally)
# In MongoDB shell: show databases

# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000 | xargs kill

# View logs
npm run dev
# Ctrl+C to stop
```

## 📚 API Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123","confirmPassword":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Places
```bash
curl http://localhost:5000/api/places
```

### Get Places (Filtered)
```bash
curl "http://localhost:5000/api/places?category=Nature&priceRange=Budget"
```

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module 'express'` | Run `npm install` |
| `MongoServerError: connect ECONNREFUSED` | Start MongoDB locally or check Atlas connection |
| `CORS error` | Ensure `FRONTEND_URL` in `.env` matches your frontend URL |
| `Port 5000 already in use` | Change PORT in `.env` or kill the process |
| `SyntaxError: Cannot use import statement` | Ensure `"type": "module"` in package.json |

## 🎓 Next Steps

1. ✅ Backend running
2. Update frontend to use real API endpoints
3. Test authentication flow (register → login → save token)
4. Test trip creation and management
5. Implement place bookmarking
6. Deploy to production (Heroku, Railway, etc.)

---

**Need help?** Run `npm run dev` and check console for errors!

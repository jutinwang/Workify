
# Workify - Co-op Job Platform - CSI4900 Honours Project  

**A Modern Take on the Co-op Experience**

**Created by**: 
- Ali Bhangu 
- Tolu Emoruwa 
- Justin Wang

## Project Overview

Workify is an innovative take on revolutionizing the co-op experience for both employers and employees. Unlike traditional co-op boards that simply list available positions, Workify focuses on finding what "works" for each individual user through personalized matching, intuitive design, and comprehensive profile management.

A full-stack web application connecting students with co-op opportunities.

## Tech Stack

**Frontend:**
- React 18
- React Router
- CSS Modules

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher): [Download](https://www.postgresql.org/download/)
- **Git**: [Download](https://git-scm.com/downloads)

Check your installations:
```bash
node --version
npm --version
psql --version
git --version
```

---

## Project Structure

```
Workify/
├── workify/              # Frontend React app
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/              # Backend API
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
cd ~/Documents/Honours\ Project/
git clone <your-repo-url> Workify
cd Workify
```

### 2. Database Setup

#### Start PostgreSQL
```bash
# macOS (if using Homebrew)
brew services start postgresql@14

# Or start manually
pg_ctl -D /usr/local/var/postgres start
```

#### Create Database
```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE workify;

# Create user (optional)
CREATE USER workify_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE workify TO workify_user;

# Exit
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/workify"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=4000
NODE_ENV=development
EOF

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed

# Start backend server
npm run dev
```

Backend should now be running at: **http://localhost:4000**

### 4. Frontend Setup

Open a **new terminal window**:

```bash
cd workify

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend should now be running at: **http://localhost:5173**

---

## Database Management with Prisma

### View Data in Prisma Studio

```bash
cd backend
npx prisma studio
```

Prisma Studio opens at: **http://localhost:5555**

### Common Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev -n


# Push schema changes without migration
npx prisma db push

# Pull schema from existing database
npx prisma db pull

# Validate schema
npx prisma validate
```

---

## Creating Test Data

### Method 1: Using Prisma Studio
1. Run `npx prisma studio` in backend folder
2. Navigate to tables in the UI
3. Click "Add record" to manually create data
4. Fill in fields and save

### Method 2: Using CURL Commands

#### Register an Employer
```bash
curl -X POST http://localhost:4000/auth/employers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@techcorp.com",
    "password": "SecurePass123!",
    "name": "Sarah Johnson",
    "workPhone": "+1-416-555-0199",
    "workEmail": "sarah.johnson@techcorp.com",
    "companyName": "TechCorp Solutions Inc.",
    "companyUrl": "https://www.techcorpsolutions.com",
    "companySize": "200-500",
    "companyAbout": "Leading software development company",
    "companyLinkedInUrl": "https://www.linkedin.com/company/techcorp"
  }'
```

#### Login and Get Token
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@techcorp.com",
    "password": "SecurePass123!"
  }'
```

**Save the token from response:**
```bash
export TOKEN="your_jwt_token_here"
```

#### Create a Job Posting
```bash
curl -X POST http://localhost:4000/employers/me/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer Intern",
    "description": "Join our engineering team to build scalable web applications.",
    "location": "Toronto, ON (Hybrid)",
    "length": "4 months (May - August 2026)",
    "type": "Full-time Co-op",
    "salary": "$28-32/hour",
    "qualification": "2nd year CS student or higher",
    "benefits": "Health coverage, learning budget, mentorship",
    "responsibilities": "Develop features, write tests, code reviews",
    "tags": ["React", "Node.js", "TypeScript", "PostgreSQL"]
  }'
```

#### Register a Student
```bash
curl -X POST http://localhost:4000/auth/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "StudentPass123!",
    "name": "John Doe",
    "phone": "+1-613-555-0100",
    "program": "Computer Science",
    "yearOfStudy": "3rd Year",
    "gpa": 3.8
  }'
```

---

## API Endpoints Reference

### Authentication
- `POST /auth/employers/register` - Register employer
- `POST /auth/students/register` - Register student
- `POST /auth/login` - Login (returns JWT token)

### Jobs
- `GET /jobs/search?title=engineer&tags=React,Node` - Search jobs
- `GET /jobs/:jobId` - Get single job details
- `POST /employers/me/jobs` - Create job (requires auth)

### Students
- `GET /students/:studentId` - Get student profile
- `PUT /students/me` - Update own profile (requires auth)

### Employers
- `GET /employers/me` - Get own employer profile (requires auth)
- `PUT /employers/me` - Update own profile (requires auth)

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 4000
lsof -ti:4000

# Kill the process
kill -9 $(lsof -ti:4000)

# Or for port 3000
kill -9 $(lsof -ti:3000)
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string in backend/.env
cat backend/.env | grep DATABASE_URL

# Test connection
cd backend
npx prisma db pull
```

### Prisma Client Issues
```bash
cd backend

# Regenerate Prisma Client
rm -rf node_modules/.prisma
npx prisma generate

# If that doesn't work, reinstall
rm -rf node_modules
npm install
npx prisma generate
```

### Frontend Not Loading
```bash
# Clear cache and reinstall
cd workify
rm -rf node_modules package-lock.json
npm install
npm start
```

### CORS Issues
Make sure backend has CORS enabled in `backend/src/index.ts`:
```typescript
import cors from 'cors';
app.use(cors());
```

---

## Development Workflow

### Daily Startup
```bash
# Terminal 1: Start PostgreSQL (if not running)
brew services start postgresql@14

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd workify
npm start

# Terminal 4 (optional): Open Prisma Studio
cd backend
npx prisma studio
```

### Making Schema Changes
```bash
cd backend

# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_field

# 3. Regenerate client (usually automatic)
npx prisma generate

# 4. Restart backend server
```

### Viewing Logs
```bash
# Backend logs appear in Terminal 2
# Frontend logs appear in Terminal 3 and browser console

# Check backend logs
cd backend
npm run dev # logs will appear here
```

---

## Stopping Services

```bash
# Stop frontend (Ctrl+C in terminal)

# Stop backend (Ctrl+C in terminal)

# Stop PostgreSQL
brew services stop postgresql@14
# Or
pg_ctl -D /usr/local/var/postgres stop

# Stop Prisma Studio (Ctrl+C in terminal)
```

---

## Testing

### Test API Endpoints
```bash
# Health check
curl http://localhost:4000/health

# Search jobs
curl http://localhost:4000/jobs/search

# Get specific job
curl http://localhost:4000/jobs/1
```

### Test Authentication Flow
1. Register account (employer or student)
2. Login and save JWT token
3. Use token in Authorization header for protected routes

---

## Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/workify"
JWT_SECRET="your-secret-key"
PORT=4000
NODE_ENV=development
```

### Frontend `.env` (optional)
```env
REACT_APP_API_URL=http://localhost:4000
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module '@prisma/client'" | Run `npx prisma generate` |
| "Port 4000 already in use" | Kill process: `kill -9 $(lsof -ti:4000)` |
| "Database connection refused" | Start PostgreSQL: `brew services start postgresql@14` |
| Frontend can't reach API | Check CORS enabled and API_URL is correct |
| "Invalid token" errors | Login again to get fresh JWT token |

---

## Production Deployment Notes

When deploying to production:

1. **Update DATABASE_URL** with production database credentials
2. **Change JWT_SECRET** to a secure random string
3. **Set NODE_ENV** to "production"
4. **Run migrations** on production database
5. **Build frontend** with `npm run build`
6. **Use HTTPS** for secure connections
7. **Set up environment variables** in your hosting platform

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review API documentation
- Check Prisma docs: https://www.prisma.io/docs
- Check React docs: https://react.dev

---

## License

[Your License Here]

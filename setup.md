# Quick Setup Guide

Follow these steps to get the Skate Sharpener Finder app running:

## 1. Install Node.js

If you don't have Node.js installed:
- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation: `node --version` and `npm --version`

## 2. Install PostgreSQL

### Option A: Local Installation
- **macOS**: `brew install postgresql@15`
- **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
- **Windows**: Download from https://www.postgresql.org/download/windows/

### Option B: Use Docker
```bash
docker run --name skate-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
```

### Option C: Cloud Database (Easiest)
Use a free tier from:
- **Supabase**: https://supabase.com (recommended)
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

## 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE skate_sharpener_db;

# Exit
\q
```

## 4. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your database credentials
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/skate_sharpener_db"
```

Generate a secret key:
```bash
openssl rand -base64 32
```
Add it to `.env` as `NEXTAUTH_SECRET`

## 5. Install Dependencies

```bash
npm install
```

## 6. Set Up Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

## 7. (Optional) View Database

```bash
# Open Prisma Studio to view/edit data
npx prisma studio
```

This opens a web interface at http://localhost:5555

## 8. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## 9. Test the App

### Create a Sharpener Account
1. Go to http://localhost:3000/auth/register
2. Select "I'm a Sharpener"
3. Fill in details and register
4. Login at http://localhost:3000/auth/login

### Add Location, Machine, and Availability
Use Prisma Studio or create API calls to add:
- A location for your sharpener
- Machines at that location
- Availability slots

### Create a User Account
1. Register as a regular user
2. Search for sharpeners
3. Request an appointment

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env
- Check firewall settings

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Migration failed"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

## Next Steps

1. Add sample data through Prisma Studio
2. Customize the UI in `app/` directory
3. Set up email notifications (optional)
4. Deploy to Vercel or your preferred platform

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database for Production
- Use managed PostgreSQL (Supabase, Railway, AWS RDS)
- Run migrations: `npx prisma migrate deploy`
- Never use development database in production

## Need Help?

Check the main README.md for:
- Full API documentation
- Database schema details
- Feature explanations
- Development guidelines

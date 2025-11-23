# Quick Start Guide

Get the Skate Sharpener Finder running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

## Installation

### Option 1: Automated (Linux/Mac)

```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database URL

# 3. Set up database
npx prisma generate
npx prisma migrate dev --name init

# 4. (Optional) Add sample data
npm run seed

# 5. Start development server
npm run dev
```

## Quick Database Setup

### Using Supabase (Easiest - Free)

1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Paste into `.env` as `DATABASE_URL`

### Using Local PostgreSQL

```bash
# Create database
createdb skate_sharpener_db

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skate_sharpener_db"
```

### Using Docker

```bash
docker run --name skate-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 -d postgres:15

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/postgres"
```

## Test the App

After running `npm run dev`, visit:

- **Homepage**: http://localhost:3000
- **Search**: http://localhost:3000/search
- **Register**: http://localhost:3000/auth/register
- **Login**: http://localhost:3000/auth/login

## Sample Accounts (if you ran seed)

**Sharpener Account:**
- Email: john.sharpener@example.com
- Password: Password123

**User Account:**
- Email: jane.user@example.com
- Password: Password123

## Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Test connection: `psql $DATABASE_URL`

### "Module not found"
```bash
npm install
npx prisma generate
```

### "Port 3000 in use"
```bash
PORT=3001 npm run dev
```

### "Prisma migration failed"
```bash
# Reset and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

## Next Steps

1. **Explore the code**: Check PROJECT_STRUCTURE.md
2. **Read full docs**: See README.md
3. **Customize**: Edit files in `app/` directory
4. **Deploy**: Push to Vercel or your platform

## Key Features to Test

1. **Register as Sharpener**
   - Add location
   - Add machines
   - Set availability

2. **Register as User**
   - Search sharpeners
   - Request appointment
   - Rate service

3. **View Database**
   ```bash
   npx prisma studio
   ```
   Opens at http://localhost:5555

## Development Tips

- Hot reload is enabled - changes appear instantly
- Check console for errors
- Use Prisma Studio to view/edit data
- API endpoints are in `app/api/`
- Pages are in `app/`

## Need Help?

- Check SETUP.md for detailed instructions
- Review README.md for full documentation
- Inspect PROJECT_STRUCTURE.md for code organization

Happy coding! 🛹

# Database Setup Guide

## Option 1: Supabase (Recommended - Free & Easy)

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

### Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name**: skate-sharpener (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free (sufficient for development)
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Step 3: Get Database Connection String

1. In your project dashboard, click "Settings" (gear icon in sidebar)
2. Click "Database" in the left menu
3. Scroll down to "Connection string"
4. Select "URI" tab
5. **IMPORTANT**: Toggle "Display connection pooling string" to ON
6. Copy the connection string (looks like this):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with the password you created in Step 2

### Step 4: Configure Your App

```bash
# Navigate to your project
cd ~/Workspace/BuyingApprovalAutomation/sharpener

# Create .env file
cp .env.example .env

# Edit the file
nano .env
```

Paste this into your `.env` file:
```env
# Replace with your actual Supabase connection string
DATABASE_URL="postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

NEXTAUTH_URL="http://localhost:3000"
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Copy the output and paste it as NEXTAUTH_SECRET value.

Save and exit (Ctrl+X, then Y, then Enter)

### Step 5: Set Up Database Tables

```bash
# Make sure you're in the sharpener directory
cd ~/Workspace/BuyingApprovalAutomation/sharpener

# Load Node.js
source ~/.bashrc

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

You should see output like:
```
✔ Generated Prisma Client
✔ Applied migration: 20231117_init
```

### Step 6: (Optional) Add Sample Data

```bash
npm run seed
```

This creates:
- Sample sharpener account (john.sharpener@example.com / Password123)
- Sample user account (jane.user@example.com / Password123)
- Sample location, machines, and availability

### Step 7: Verify Database

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can see all your tables and data.

---

## Option 2: Railway (Alternative)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Verify your email

### Step 2: Create New Project

1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Wait for database to be created

### Step 3: Get Connection String

1. Click on the PostgreSQL service
2. Go to "Variables" tab
3. Copy the value of `DATABASE_URL`

### Step 4: Configure Your App

Follow Step 4 from Supabase instructions above, using Railway's DATABASE_URL instead.

---

## Option 3: Local PostgreSQL (Advanced)

If you want to install PostgreSQL locally on Amazon Linux 2:

```bash
# Install PostgreSQL
sudo amazon-linux-extras install postgresql14

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb skate_sharpener_db

# Create user and set password
sudo -u postgres psql -c "CREATE USER your_username WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE skate_sharpener_db TO your_username;"

# Your DATABASE_URL will be:
# postgresql://your_username:your_password@localhost:5432/skate_sharpener_db
```

Then follow Step 4 from Supabase instructions.

---

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Make sure .env file exists in sharpener directory
- Check that DATABASE_URL is set correctly
- No spaces around the = sign

### "Can't reach database server"
- Check your internet connection
- Verify the connection string is correct
- Make sure you replaced [YOUR-PASSWORD] with actual password
- For Supabase, ensure you're using the pooled connection string

### "Migration failed"
- Check DATABASE_URL is correct
- Ensure database is accessible
- Try: `npx prisma migrate reset` (WARNING: deletes all data)

### "Prisma Client not generated"
```bash
npx prisma generate
```

### Connection timeout
- Check firewall settings
- Verify database service is running
- Try a different region if using Supabase

---

## Next Steps After Database Setup

Once your database is set up and migrations are complete:

```bash
# Start the development server
npm run dev
```

Visit http://localhost:3000 to see your app!

## Useful Commands

```bash
# View database in GUI
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name migration_name

# Reset database (deletes all data!)
npx prisma migrate reset

# Check database connection
npx prisma db pull
```

---

## What Gets Created

Your database will have these tables:
1. **tblUsers** - Customer accounts
2. **tblSharpeners** - Sharpener accounts
3. **tblSharpenerLocations** - Business locations
4. **tblSharpeningMachines** - Equipment details
5. **tblAvailability** - Time slots and pricing
6. **tblAppointments** - Booking requests
7. **tblRatings** - Reviews and ratings

All with proper relationships and constraints!





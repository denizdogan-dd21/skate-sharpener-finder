# Complete Database Setup

## ✅ What's Already Done

1. ✅ PostgreSQL installed (version 9.2.24)
2. ✅ PostgreSQL service started and enabled
3. ✅ .env file created with database configuration

## 🔧 What You Need to Do

You need to run 2 commands with sudo to create the database and set a password.

### Step 1: Create the Database

```bash
sudo -u postgres createdb skate_sharpener_db
```

### Step 2: Set PostgreSQL Password

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres123';"
```

### Step 3: Generate Prisma Client

```bash
source ~/.bashrc
cd ~/Workspace/BuyingApprovalAutomation/sharpener
npx prisma generate
```

### Step 4: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create all 7 tables:
- tblUsers
- tblSharpeners
- tblSharpenerLocations
- tblSharpeningMachines
- tblAvailability
- tblAppointments
- tblRatings

### Step 5: (Optional) Add Sample Data

```bash
npm run seed
```

This creates:
- Sample sharpener account (john.sharpener@example.com / Password123)
- Sample user account (jane.user@example.com / Password123)
- 1 location in Boston
- 2 machines
- 7 days of availability
- 1 sample appointment with rating

### Step 6: Start the App!

```bash
npm run dev
```

Visit: http://localhost:3000

## 🔍 Verify Database Connection

After Step 2, test the connection:

```bash
psql -U postgres -d skate_sharpener_db -h localhost
# Password: postgres123
```

If connected successfully, type `\q` to exit.

## 📊 View Database (Optional)

After migrations, you can view your database in a GUI:

```bash
npx prisma studio
```

Opens at: http://localhost:5555

## 🐛 Troubleshooting

### "FATAL: Peer authentication failed"

Edit PostgreSQL config:
```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

Change this line:
```
local   all             all                                     peer
```

To:
```
local   all             all                                     md5
```

Then restart:
```bash
sudo systemctl restart postgresql
```

### "database does not exist"

Make sure you ran Step 1 to create the database.

### "Prisma Client not generated"

Run:
```bash
npx prisma generate
```

### "Cannot connect to database"

Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

## 📝 Database Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: skate_sharpener_db
- **User**: postgres
- **Password**: postgres123

These are already configured in your `.env` file!

## 🎯 Quick Command Summary

```bash
# 1. Create database (needs sudo)
sudo -u postgres createdb skate_sharpener_db

# 2. Set password (needs sudo)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres123';"

# 3. Load Node.js
source ~/.bashrc

# 4. Navigate to project
cd ~/Workspace/BuyingApprovalAutomation/sharpener

# 5. Generate Prisma client
npx prisma generate

# 6. Run migrations
npx prisma migrate dev --name init

# 7. Seed data (optional)
npm run seed

# 8. Start app
npm run dev
```

That's it! Your database will be ready to go! 🚀



	


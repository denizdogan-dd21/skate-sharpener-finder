# Deployment Guide: Vercel + Supabase

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Supabase account (sign up at supabase.com)

---

## Part 1: Setup Supabase Database (5 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name:** `skate-sharpener-app`
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 2. Get Connection Strings
1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy **Connection pooling** URL (for DATABASE_URL):
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
4. Copy **Direct connection** URL (for DIRECT_URL):
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```
5. Replace `[PASSWORD]` with your actual database password in both URLs

---

## Part 2: Push Your Code to GitHub

### 1. Initialize Git Repository
```bash
cd /home/ddogan/Workspace/SharpeningApp
git init
git add .
git commit -m "Initial commit - Skate Sharpener Finder"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `skate-sharpener-app`
3. Make it **Private** (recommended)
4. Click **"Create repository"**

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/skate-sharpener-app.git
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy Database to Supabase

### 1. Set Environment Variables Locally
Create a temporary `.env.supabase` file with your Supabase URLs:
```bash
DATABASE_URL="[YOUR-POOLING-URL]"
DIRECT_URL="[YOUR-DIRECT-URL]"
```

### 2. Run Prisma Migration
```bash
# Use the Supabase connection
export DATABASE_URL="[YOUR-POOLING-URL]"
export DIRECT_URL="[YOUR-DIRECT-URL]"

# Push schema to Supabase
npx prisma db push

# Seed the database (optional)
npx prisma db seed
```

---

## Part 4: Deploy to Vercel (5 minutes)

### 1. Connect to Vercel
1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository: `skate-sharpener-app`
4. Vercel will auto-detect Next.js

### 2. Configure Environment Variables
In Vercel project settings, add these environment variables:

**Required:**
```
DATABASE_URL = [YOUR-SUPABASE-POOLING-URL]
DIRECT_URL = [YOUR-SUPABASE-DIRECT-URL]
NEXTAUTH_SECRET = [Generate with: openssl rand -base64 32]
NEXTAUTH_URL = https://your-app.vercel.app
```

**Email (Optional but recommended):**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = denizdogan@gmail.com
SMTP_PASSWORD = mfdi pdga itsb bexo
SMTP_FROM = denizdogan@gmail.com
```

### 3. Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app will be live at `https://your-app.vercel.app`

---

## Part 5: Post-Deployment

### 1. Update NEXTAUTH_URL
1. Copy your Vercel deployment URL (e.g., `https://skate-sharpener-app.vercel.app`)
2. In Vercel settings, update `NEXTAUTH_URL` to your actual URL
3. Redeploy (Vercel will auto-redeploy on env var change)

### 2. Test Your Application
- Register a new user
- Create a sharpener account
- Test booking functionality
- Verify emails are being sent

### 3. Custom Domain (Optional)
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel, go to **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

---

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Supabase project is active (not paused)
- Ensure password doesn't contain special characters that need URL encoding

### Build Failures
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check
```

### Email Not Working
- Verify SMTP credentials
- Check Gmail "Less secure app access" or use App Password
- Test with a different email provider if needed

---

## Cost Summary

✅ **Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited personal projects
- Automatic SSL
- 100 builds/month

✅ **Supabase Free Tier:**
- 500MB database
- 2GB bandwidth/month
- 50,000 monthly active users
- Daily backups (7 days retention)

**Total Monthly Cost: $0** 🎉

---

## Next Steps

1. Set up monitoring (Vercel Analytics - free)
2. Add custom domain
3. Configure email verification
4. Set up database backups
5. Add more features!

---

## Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Update database schema
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Deploy to Vercel (if using CLI)
vercel deploy --prod
```

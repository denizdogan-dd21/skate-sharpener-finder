# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (Supabase, Railway, or Neon)

### Steps

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Vercel auto-detects Next.js

3. **Configure Environment Variables**
Add these in Vercel dashboard:
```
DATABASE_URL=your-postgresql-url
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
```

4. **Deploy Database**
```bash
# Run migrations on production database
npx prisma migrate deploy
```

5. **Deploy!**
- Click "Deploy"
- Your app will be live at `your-app.vercel.app`

## Database Options

### Option 1: Supabase (Recommended)
**Pros:** Free tier, easy setup, includes auth
**Cons:** Limited to 500MB on free tier

```bash
# 1. Create project at supabase.com
# 2. Get connection string from Settings → Database
# 3. Use "Connection Pooling" URL for production
DATABASE_URL="postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true"
```

### Option 2: Railway
**Pros:** Simple, includes PostgreSQL, generous free tier
**Cons:** Requires credit card

```bash
# 1. Create project at railway.app
# 2. Add PostgreSQL service
# 3. Copy DATABASE_URL from variables
```

### Option 3: Neon
**Pros:** Serverless PostgreSQL, free tier
**Cons:** Newer service

```bash
# 1. Create project at neon.tech
# 2. Copy connection string
# 3. Use pooled connection for production
```

### Option 4: AWS RDS
**Pros:** Enterprise-grade, scalable
**Cons:** More complex, costs more

## Alternative Deployment Platforms

### Railway

1. **Connect GitHub**
```bash
# Push to GitHub first
```

2. **Deploy**
- Go to railway.app
- New Project → Deploy from GitHub
- Select repository
- Add PostgreSQL service
- Set environment variables

3. **Configure**
```bash
# Railway auto-detects Next.js
# Add environment variables in dashboard
```

### Render

1. **Create Web Service**
- Go to render.com
- New → Web Service
- Connect GitHub repository

2. **Configure Build**
```
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm start
```

3. **Add Database**
- Create PostgreSQL instance
- Link to web service
- Set DATABASE_URL

### DigitalOcean App Platform

1. **Create App**
- Go to cloud.digitalocean.com
- Apps → Create App
- Connect GitHub

2. **Configure**
```
Build Command: npm install && npx prisma generate && npm run build
Run Command: npm start
```

3. **Add Database**
- Create Managed PostgreSQL
- Add connection string to environment

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/skate_sharpener_db
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=skate_sharpener_db
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Deploy
```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
```

## Environment Variables

### Required
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"
```

### Optional (Future)
```bash
# Email service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Test production build locally: `npm run build && npm start`
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Set up SSL certificate (automatic on Vercel/Railway)
- [ ] Configure custom domain (optional)
- [ ] Test all critical user flows
- [ ] Set up error monitoring (Sentry)
- [ ] Configure database backups
- [ ] Review security settings
- [ ] Add privacy policy and terms of service
- [ ] Set up monitoring/uptime checks

## Post-Deployment

### 1. Test Production
```bash
# Test key endpoints
curl https://your-app.com/api/sharpeners/search
curl https://your-app.com
```

### 2. Monitor Logs
- Check Vercel/Railway logs for errors
- Set up error tracking (Sentry, LogRocket)

### 3. Set Up Monitoring
- Uptime monitoring (UptimeRobot, Pingdom)
- Performance monitoring (Vercel Analytics)
- Database monitoring

### 4. Configure Backups
```bash
# Automated PostgreSQL backups
# Most managed databases include this
```

### 5. Set Up CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate auto-configured

### Railway
1. Go to Settings → Domains
2. Add custom domain
3. Update CNAME record
4. SSL auto-configured

## Database Migrations

### Production Migrations
```bash
# NEVER use migrate dev in production
# Use migrate deploy instead
npx prisma migrate deploy
```

### Rollback Strategy
```bash
# Create backup before migration
pg_dump $DATABASE_URL > backup.sql

# If migration fails, restore
psql $DATABASE_URL < backup.sql
```

## Performance Optimization

### 1. Enable Caching
```typescript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
```

### 2. Database Connection Pooling
```bash
# Use connection pooling in production
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
```

### 3. Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'
```

## Security Hardening

### 1. Environment Variables
- Never commit .env files
- Use secrets management
- Rotate secrets regularly

### 2. Rate Limiting
```typescript
// Add rate limiting middleware (future)
import rateLimit from 'express-rate-limit'
```

### 3. CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'your-domain.com' }
        ]
      }
    ]
  }
}
```

### 4. Security Headers
```typescript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' }
      ]
    }
  ]
}
```

## Scaling Considerations

### Horizontal Scaling
- Vercel auto-scales
- Railway supports scaling
- Use load balancer for custom deployments

### Database Scaling
- Connection pooling (PgBouncer)
- Read replicas for heavy read loads
- Vertical scaling (increase resources)

### Caching Strategy
- Redis for session storage
- CDN for static assets
- API response caching

## Troubleshooting

### Build Fails
```bash
# Check build logs
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Prisma client not generated

# Fix:
npm run build  # Test locally first
```

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check:
# - Firewall rules
# - IP whitelist
# - SSL requirements
```

### 500 Errors
```bash
# Check logs in platform dashboard
# Enable detailed error logging
# Set up Sentry for error tracking
```

## Monitoring & Alerts

### Set Up Alerts
- Uptime monitoring
- Error rate alerts
- Database performance
- API response times

### Recommended Tools
- **Sentry** - Error tracking
- **Vercel Analytics** - Performance
- **UptimeRobot** - Uptime monitoring
- **LogRocket** - Session replay

## Backup Strategy

### Database Backups
```bash
# Automated daily backups
# Most managed databases include this

# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Code Backups
- Git repository (GitHub, GitLab)
- Multiple branches
- Tagged releases

## Cost Estimation

### Free Tier (Hobby Projects)
- Vercel: Free (hobby plan)
- Supabase: Free (500MB database)
- Total: $0/month

### Small Business
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Domain: $12/year
- Total: ~$45/month

### Growing Business
- Vercel Enterprise: Custom
- Managed PostgreSQL: $50-200/month
- CDN: $20-50/month
- Monitoring: $30/month
- Total: $100-300/month

## Support & Maintenance

### Regular Tasks
- Monitor error logs
- Review performance metrics
- Update dependencies monthly
- Database maintenance
- Security patches

### Quarterly Reviews
- Performance optimization
- Cost analysis
- Feature usage analytics
- User feedback review

## Getting Help

- Vercel Discord: https://vercel.com/discord
- Next.js Discussions: https://github.com/vercel/next.js/discussions
- Prisma Discord: https://pris.ly/discord
- Stack Overflow: Tag with `next.js`, `prisma`

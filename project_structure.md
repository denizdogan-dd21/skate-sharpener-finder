# Project Structure

```
sharpener/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts      # User/Sharpener registration
│   │   │   └── login/
│   │   │       └── route.ts      # Authentication
│   │   │
│   │   ├── sharpeners/
│   │   │   ├── search/
│   │   │   │   └── route.ts      # Search sharpeners by location
│   │   │   └── [id]/
│   │   │       └── route.ts      # Get sharpener profile
│   │   │
│   │   ├── appointments/
│   │   │   ├── route.ts          # Create/list appointments
│   │   │   └── [id]/
│   │   │       └── route.ts      # Update appointment status
│   │   │
│   │   ├── ratings/
│   │   │   └── route.ts          # Submit ratings
│   │   │
│   │   └── sharpener/            # Sharpener management
│   │       ├── locations/
│   │       │   └── route.ts      # Manage locations
│   │       ├── machines/
│   │       │   └── route.ts      # Manage machines
│   │       └── availability/
│   │           └── route.ts      # Manage availability
│   │
│   ├── auth/                     # Authentication Pages
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   │
│   ├── search/
│   │   └── page.tsx              # Search sharpeners page
│   │
│   ├── layout.tsx                # Root layout (nav, footer)
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── lib/                          # Utility functions
│   ├── prisma.ts                 # Prisma client singleton
│   └── auth.ts                   # Auth helpers (hashing, validation)
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data seeder
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS config for Tailwind
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Full documentation
├── SETUP.md                      # Quick setup guide
└── PROJECT_STRUCTURE.md          # This file

```

## Key Files Explained

### Database & ORM
- **prisma/schema.prisma**: Defines all database tables and relationships
- **lib/prisma.ts**: Singleton Prisma client for database queries
- **prisma/seed.ts**: Creates sample data for testing

### Authentication
- **lib/auth.ts**: Password hashing, validation utilities
- **app/api/auth/register/route.ts**: User/sharpener registration endpoint
- **app/api/auth/login/route.ts**: Login endpoint
- **app/auth/login/page.tsx**: Login UI
- **app/auth/register/page.tsx**: Registration UI

### Core Features

#### For Users
- **app/search/page.tsx**: Search sharpeners by location
- **app/api/sharpeners/search/route.ts**: Search API
- **app/api/sharpeners/[id]/route.ts**: View sharpener profile
- **app/api/appointments/route.ts**: Request appointments
- **app/api/ratings/route.ts**: Submit ratings

#### For Sharpeners
- **app/api/sharpener/locations/route.ts**: Add/manage locations
- **app/api/sharpener/machines/route.ts**: Add/manage machines
- **app/api/sharpener/availability/route.ts**: Set availability & pricing
- **app/api/appointments/[id]/route.ts**: Accept/deny requests

### Configuration
- **.env.example**: Template for environment variables
- **next.config.js**: Next.js settings
- **tailwind.config.ts**: Tailwind CSS theme customization
- **tsconfig.json**: TypeScript compiler options

## Data Flow Examples

### User Books Appointment
1. User searches → `GET /api/sharpeners/search`
2. Views profile → `GET /api/sharpeners/[id]`
3. Requests appointment → `POST /api/appointments`
4. Database creates appointment with status PENDING
5. Database creates empty rating entry

### Sharpener Accepts Request
1. Sharpener views requests → `GET /api/appointments?sharpenerId=X`
2. Accepts request → `PATCH /api/appointments/[id]` (status: CONFIRMED)
3. User sees full contact info (progressive disclosure)

### User Rates Service
1. After appointment → `POST /api/ratings`
2. Updates rating entry with score & comment
3. Changes appointment status to RATED

## Database Tables

1. **tblUsers** - Customer accounts
2. **tblSharpeners** - Sharpener accounts  
3. **tblSharpenerLocations** - Business locations
4. **tblSharpeningMachines** - Equipment details
5. **tblAvailability** - Time slots & pricing
6. **tblAppointments** - Booking requests
7. **tblRatings** - Reviews & ratings

See `prisma/schema.prisma` for full schema details.

## Adding New Features

### Add a new page
1. Create `app/your-page/page.tsx`
2. Add link in `app/layout.tsx` navigation

### Add a new API endpoint
1. Create `app/api/your-endpoint/route.ts`
2. Export GET, POST, PATCH, or DELETE functions
3. Use Prisma client from `lib/prisma.ts`

### Add a new database table
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Update TypeScript types automatically generated

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for sessions
- `NEXTAUTH_URL` - App URL (http://localhost:3000)

Optional:
- Email service credentials (for notifications)
- Google Maps API key (for location features)

## Development Workflow

1. Make changes to code
2. Next.js hot-reloads automatically
3. Test in browser at http://localhost:3000
4. Check database in Prisma Studio: `npx prisma studio`
5. Commit changes to git

## Production Checklist

- [ ] Set all environment variables
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Build app: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Set up SSL certificate
- [ ] Configure domain name
- [ ] Set up monitoring/logging
- [ ] Enable CORS if needed
- [ ] Set up automated backups



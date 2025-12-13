# Skate Sharpener Finder

A web application connecting skate sharpeners with users who need sharpening services.

## Features

### For Users
- Browse and search sharpeners by location
- View sharpener profiles with ratings and reviews
- See availability schedules, machines, and pricing
- Request appointments with structured workflow
- Rate and review sharpeners after service
- Progressive disclosure of contact information (only after appointment confirmation)

### For Sharpeners
- Create profile with multiple locations
- Manage sharpening machines and radius options
- Set availability schedules and pricing
- Accept/deny appointment requests
- View appointment history
- Build reputation through ratings

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: bcryptjs for password hashing

## Database Schema

### Tables
1. **tblUsers** - Customer accounts
2. **tblSharpeners** - Sharpener accounts
3. **tblSharpenerLocations** - Sharpener business locations
4. **tblSharpeningMachines** - Equipment and radius options
5. **tblAvailability** - Time slots and pricing
6. **tblAppointments** - Booking requests and confirmations
7. **tblRatings** - User reviews and ratings

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

3. **Set up database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

4. **Run development server**
```bash
npm run dev
```

Visit http://localhost:3000

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Project Structure

```
sharpener/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── appointments/ # Appointment management
│   │   ├── ratings/      # Rating system
│   │   ├── sharpeners/   # Sharpener search and profiles
│   │   └── sharpener/    # Sharpener management (locations, machines, availability)
│   ├── layout.tsx        # Root layout with navigation
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Prisma client instance
│   └── auth.ts           # Authentication utilities
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user or sharpener
- `POST /api/auth/login` - Login

### Sharpeners (Public)
- `GET /api/sharpeners/search` - Search sharpeners by location
- `GET /api/sharpeners/[id]` - Get sharpener profile

### Appointments
- `POST /api/appointments` - Create appointment request
- `GET /api/appointments` - Get user's or sharpener's appointments
- `GET /api/appointments/[id]` - Get appointment details
- `PATCH /api/appointments/[id]` - Update appointment status

### Ratings
- `POST /api/ratings` - Submit rating for completed appointment

### Sharpener Management
- `POST /api/sharpener/locations` - Add location
- `GET /api/sharpener/locations` - Get locations
- `POST /api/sharpener/machines` - Add machine
- `GET /api/sharpener/machines` - Get machines
- `POST /api/sharpener/availability` - Add availability
- `GET /api/sharpener/availability` - Get availabilities
- `DELETE /api/sharpener/availability` - Remove availability

## Appointment Workflow

1. **User browses** sharpeners (no contact info visible)
2. **User requests** appointment for specific time slot
3. **Sharpener sees** request with user's name and phone
4. **Sharpener accepts** → Both see full contact details
5. **Direct communication** via phone/text to finalize
6. **After appointment** → User rates the service

### Status Flow
```
PENDING → CONFIRMED → COMPLETED → RATED
        ↓           ↓
      DENIED    CANCELLED
        ↓
      EXPIRED (24hr timeout)
```

## Security Features

- Password hashing with bcryptjs
- Email verification required before booking
- Progressive disclosure of contact information
- Authorization checks on all protected endpoints
- SQL injection protection via Prisma

## Future Enhancements

- Email notifications (SendGrid/Resend integration)
- Google Maps integration for location search
- Image uploads for sharpener profiles
- Appointment reminders
- Favorite sharpeners
- Advanced search filters
- Mobile app

## Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Recommended platforms:
- **Vercel** (easiest for Next.js)
- **Railway** or **Render** (with PostgreSQL)
- **AWS** (EC2 + RDS)

Remember to:
1. Set environment variables in production
2. Run `npx prisma migrate deploy`
3. Configure CORS if needed
4. Set up SSL certificate

## License

MIT

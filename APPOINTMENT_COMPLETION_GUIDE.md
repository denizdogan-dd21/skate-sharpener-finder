# Appointment Auto-Completion Setup

## Overview
The system now has a hybrid approach to mark appointments as COMPLETED:

### 1. User-Initiated Completion
- Users see a **"Complete & Rate"** button for CONFIRMED appointments
- Button only appears after the appointment end time has passed
- Clicking marks the appointment as COMPLETED and opens the rating form
- Encourages immediate ratings for better feedback quality

### 2. Sharpener-Initiated Completion
- Sharpeners see a **"Mark as Complete"** button in their dashboard
- Only visible for CONFIRMED appointments after end time
- Gives sharpeners control to complete appointments manually

### 3. Automatic Completion (Cron Job)
- Runs every 6 hours via Vercel Cron
- Auto-completes CONFIRMED appointments where end time + 8 hours < now
- Creates rating entries for newly completed appointments
- Prevents appointments from getting stuck in CONFIRMED status

## Vercel Setup

### Environment Variable
Make sure `CRON_SECRET` is set in Vercel:

1. Go to: https://vercel.com/[your-project]/settings/environment-variables
2. Add variable:
   - Key: `CRON_SECRET`
   - Value: Generate with `openssl rand -base64 32`
   - Scope: Production (and Preview if needed)

### Cron Job Configuration
The `vercel.json` file is already configured:
```json
{
  "crons": [
    {
      "path": "/api/cron/complete-appointments",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Schedule runs at: 12 AM, 6 AM, 12 PM, 6 PM daily

### Testing the Cron Job
You can manually trigger it:
```bash
curl -X GET https://your-domain.vercel.app/api/cron/complete-appointments \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Monitoring
Check Vercel logs to see cron job executions:
- Go to: Vercel Dashboard → Deployments → [Latest] → Functions
- Look for `/api/cron/complete-appointments` executions
- Should show: "Successfully auto-completed X appointments"

## How It Works

### Timeline Example
```
Appointment: Dec 2, 2025 at 10:00-10:15 AM
Status: CONFIRMED

10:15 AM - Appointment ends
  ↓
10:15 AM+ - User can click "Complete & Rate" OR Sharpener can "Mark as Complete"
  ↓
6:15 PM - 8 hours after end time
  ↓
Next cron run (12 PM or 6 PM) - Auto-completes if still CONFIRMED
  ↓
Status: COMPLETED
  ↓
User can now rate the appointment
  ↓
Status: RATED (after user submits rating)
```

## Benefits
- ✅ Users prompted to rate immediately after service
- ✅ Sharpeners have control to complete appointments
- ✅ No appointments stuck in CONFIRMED status
- ✅ Automatic cleanup runs 4 times per day
- ✅ Better rating collection and feedback quality

import nodemailer from 'nodemailer'

// For development: Use Ethereal Email (fake SMTP service)
// Emails are captured at https://ethereal.email
// Run this once to get test credentials: https://ethereal.email/create

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount()
  console.log('Test Email Account Created:')
  console.log('User:', testAccount.user)
  console.log('Pass:', testAccount.pass)
  console.log('View emails at: https://ethereal.email/messages')
  return testAccount
}

// Use in development
export async function getDevTransporter() {
  if (process.env.NODE_ENV === 'production') {
    // Use real SMTP in production
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  // Development: Use Ethereal
  const testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  console.log('📧 Development Email Service Ready')
  console.log('Preview emails at: https://ethereal.email/messages')
  
  return transporter
}

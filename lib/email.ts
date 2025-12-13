import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface AppointmentEmailData {
  appointmentId: number
  userName: string
  userEmail: string
  userPhone: string
  sharpenerName: string
  sharpenerEmail: string
  date: string
  startTime: string
  endTime: string
  locationName: string
  locationAddress?: string
  machineType?: string
  notes?: string
}

export async function sendAppointmentRequestEmail(data: AppointmentEmailData) {
  const acceptUrl = `${process.env.NEXTAUTH_URL}/api/appointments/${data.appointmentId}/accept`
  const denyUrl = `${process.env.NEXTAUTH_URL}/api/appointments/${data.appointmentId}/deny`

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: data.sharpenerEmail,
    subject: `New Appointment Request from ${data.userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Appointment Request</h2>
        <p>You have received a new appointment request:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Customer Details:</h3>
          <p><strong>Name:</strong> ${data.userName}</p>
          <p><strong>Phone:</strong> ${data.userPhone}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details:</h3>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p><strong>Location:</strong> ${data.locationName}</p>
          ${data.machineType ? `<p><strong>Machine:</strong> ${data.machineType}</p>` : ''}
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>

        <div style="margin: 30px 0;">
          <a href="${acceptUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px;">Accept Appointment</a>
          <a href="${denyUrl}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Decline Appointment</a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">Or login to your dashboard to manage this request: <a href="${process.env.NEXTAUTH_URL}/dashboard">${process.env.NEXTAUTH_URL}/dashboard</a></p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Appointment request email sent to:', data.sharpenerEmail)
  } catch (error) {
    console.error('Error sending appointment request email:', error)
    throw error
  }
}

export async function sendAppointmentAcceptedEmail(data: AppointmentEmailData) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: data.userEmail,
    subject: `Appointment Confirmed with ${data.sharpenerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">✓ Appointment Confirmed!</h2>
        <p>Great news! ${data.sharpenerName} has accepted your appointment request.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #166534;">Appointment Details:</h3>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p><strong>Location:</strong> ${data.locationName}</p>
          ${data.locationAddress ? `<p><strong>Address:</strong> ${data.locationAddress}</p>` : ''}
          ${data.machineType ? `<p><strong>Machine:</strong> ${data.machineType}</p>` : ''}
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Sharpener Contact:</h3>
          <p><strong>Name:</strong> ${data.sharpenerName}</p>
          <p><strong>Email:</strong> ${data.sharpenerEmail}</p>
        </div>

        <p>View your appointments: <a href="${process.env.NEXTAUTH_URL}/appointments">${process.env.NEXTAUTH_URL}/appointments</a></p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Appointment accepted email sent to:', data.userEmail)
  } catch (error) {
    console.error('Error sending appointment accepted email:', error)
    throw error
  }
}

export async function sendAppointmentDeniedEmail(data: AppointmentEmailData) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: data.userEmail,
    subject: `Appointment Request Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Request Declined</h2>
        <p>Unfortunately, ${data.sharpenerName} is unable to accept your appointment request for:</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p><strong>Location:</strong> ${data.locationName}</p>
        </div>

        <p>We encourage you to search for other available sharpeners in your area.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/search" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Find Another Sharpener</a></p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Appointment denied email sent to:', data.userEmail)
  } catch (error) {
    console.error('Error sending appointment denied email:', error)
    throw error
  }
}

export async function sendAppointmentCancelledEmail(data: AppointmentEmailData) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: data.sharpenerEmail,
    subject: `Appointment Cancelled by ${data.userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Appointment Cancelled</h2>
        <p>${data.userName} has cancelled their appointment.</p>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">Cancelled Appointment:</h3>
          <p><strong>Customer:</strong> ${data.userName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p><strong>Location:</strong> ${data.locationName}</p>
        </div>

        <p>This time slot is now available for other customers.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a></p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Appointment cancelled email sent to:', data.sharpenerEmail)
  } catch (error) {
    console.error('Error sending appointment cancelled email:', error)
    throw error
  }
}

interface VerificationEmailData {
  email: string
  firstName: string
  accountType: 'user' | 'sharpener'
  verificationUrl: string
}

export async function sendVerificationEmail(data: VerificationEmailData) {
  const accountLabel = data.accountType === 'user' ? 'Customer' : 'Sharpener'
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: 'Verify Your Email - Skate Sharpener Finder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Skate Sharpener Finder!</h2>
        <p>Hi ${data.firstName},</p>
        <p>Thank you for creating a ${accountLabel} account. Please verify your email address to get started.</p>
        
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
          <p style="margin: 0;">Click the button below to verify your email address:</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${data.verificationUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Verify Email Address</a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #6b7280; font-size: 14px; word-break: break-all;">${data.verificationUrl}</p>

        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Important:</strong> This verification link will expire in 24 hours.</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">If you didn't create an account with Skate Sharpener Finder, please ignore this email.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Verification email sent to:', data.email)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

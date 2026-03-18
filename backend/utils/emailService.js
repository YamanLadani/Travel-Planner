import nodemailer from 'nodemailer'

// Lazy-initialized transporter — created on first use so that
// process.env values from dotenv.config() are available.
let _transporter = null

function getTransporter() {
  if (!_transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL_USER or EMAIL_PASS is not set in .env — cannot send emails')
      return null
    }
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    console.log(`✓ Email transporter initialized for ${process.env.EMAIL_USER}`)
  }
  return _transporter
}

/**
 * Send a welcome email to newly registered users
 */
export const sendWelcomeEmail = async (toEmail, username) => {
  if (!toEmail) {
    console.log('⚠ No email provided, skipping welcome email')
    return
  }

  const mailOptions = {
    from: `"TravelPlanner ✈️" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🌍 Welcome to TravelPlanner — Your Adventure Starts Here!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f2f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb); padding: 50px 40px; text-align: center; border-radius: 0 0 30px 30px;">
            <div style="font-size: 48px; margin-bottom: 12px;">✈️</div>
            <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 8px 0; font-weight: 800; letter-spacing: -0.5px;">
              Welcome to TravelPlanner!
            </h1>
            <p style="color: #c7d2fe; font-size: 16px; margin: 0;">
              Your journey to amazing destinations begins now
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 40px 20px;">
            <h2 style="color: #1e293b; font-size: 22px; margin: 0 0 16px 0;">
              Hey ${username || 'Traveler'} 👋
            </h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
              We're thrilled to have you on board! TravelPlanner is your all-in-one companion for discovering, planning, and experiencing unforgettable trips around the world.
            </p>

            <!-- Features -->
            <div style="background: #f8fafc; border-radius: 16px; padding: 28px; margin-bottom: 28px;">
              <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 20px 0; font-weight: 700;">
                🚀 Here's what you can do:
              </h3>
              
              <div style="margin-bottom: 16px; display: flex; align-items: flex-start;">
                <span style="font-size: 24px; margin-right: 12px; line-height: 1;">🗺️</span>
                <div>
                  <strong style="color: #1e293b;">Explore Places</strong>
                  <p style="color: #64748b; margin: 4px 0 0; font-size: 14px;">Browse thousands of destinations with ratings, photos & details</p>
                </div>
              </div>
              
              <div style="margin-bottom: 16px; display: flex; align-items: flex-start;">
                <span style="font-size: 24px; margin-right: 12px; line-height: 1;">📍</span>
                <div>
                  <strong style="color: #1e293b;">Nearby Spots</strong>
                  <p style="color: #64748b; margin: 4px 0 0; font-size: 14px;">Find famous temples, parks & monuments near your location</p>
                </div>
              </div>
              
              <div style="margin-bottom: 16px; display: flex; align-items: flex-start;">
                <span style="font-size: 24px; margin-right: 12px; line-height: 1;">🤖</span>
                <div>
                  <strong style="color: #1e293b;">AI Travel Assistant</strong>
                  <p style="color: #64748b; margin: 4px 0 0; font-size: 14px;">Get personalized recommendations powered by AI</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start;">
                <span style="font-size: 24px; margin-right: 12px; line-height: 1;">📋</span>
                <div>
                  <strong style="color: #1e293b;">Plan Trips</strong>
                  <p style="color: #64748b; margin: 4px 0 0; font-size: 14px;">Create and organize your dream itineraries effortlessly</p>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                Start Exploring →
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
              If you have any questions, just reply to this email — we're happy to help!
            </p>
          </div>

          <!-- Footer -->
          <div style="padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0;">
              Made with ❤️ by the TravelPlanner Team
            </p>
            <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} TravelPlanner. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `
  }

  try {
    const transporter = getTransporter()
    if (!transporter) {
      console.error('❌ Email transporter not available — skipping welcome email')
      return
    }
    const info = await transporter.sendMail(mailOptions)
    console.log(`✉️ Welcome email sent to ${toEmail} (ID: ${info.messageId})`)
    return info
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message)
    console.error('   Full error:', error)
    // Don't throw — email failure shouldn't block registration
  }
}

const nodemailer = require("nodemailer");

require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready to send messages");
  }
});

// Generic email sending function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"SkillBridge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const subject = "SkillBridge - Verify Your Email";
  const text = `Your SkillBridge verification code is: ${otp}. This code will expire in 5 minutes.`;
  const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2C3E50; margin: 0;">SkillBridge</h1>
                <p style="color: #7F8C8D; margin: 5px 0;">Where Talent Meets Opportunity</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #2C3E50; margin-top: 0;">Verify Your Email</h2>
                <p>Welcome to SkillBridge! Please use the verification code below to complete your registration:</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #3498DB; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p>This code will expire in 5 minutes.</p>
                <p style="color: #7F8C8D; font-size: 12px; margin-top: 20px;">
                    If you didn't request this verification code, please ignore this email.
                </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #7F8C8D; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
            </div>
        </div>
    `;

  return await sendEmail({ to: email, subject, text, html });
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const subject = "Welcome to SkillBridge! ";
  const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2C3E50; margin: 0;">SkillBridge</h1>
                <p style="color: #7F8C8D; margin: 5px 0;">Where Talent Meets Opportunity</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #2C3E50;">Welcome to SkillBridge, ${firstName}! </h2>
                <p>Thank you for joining our community of talented professionals and businesses.</p>
                <div style="margin: 20px 0;">
                    <h3 style="color: #3498DB;">What's Next?</h3>
                    <ul style="color: #2C3E50; line-height: 1.6;">
                        <li>Complete your profile to stand out</li>
                        <li>Browse available projects</li>
                        <li>Connect with potential clients or freelancers</li>
                        <li>Start your journey to success</li>
                    </ul>
                </div>
                <p>If you have any questions, our support team is always here to help!</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="background-color: #3498DB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #7F8C8D; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
                <p>You're receiving this email because you recently created a new SkillBridge account.</p>
            </div>
        </div>
    `;

  return await sendEmail({
    to: email,
    subject,
    text: `Welcome to SkillBridge, ${firstName}!`,
    html,
  });
};

// Send login notification email
const sendLoginNotificationEmail = async (email, { name, location, device, time }) => {
  const subject = "New Login to Your SkillBridge Account";
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a56db; margin: 0; font-size: 24px;">SkillBridge</h1>
        <p style="color: #6b7280; margin-top: 5px;">Security Alert</p>
      </div>

      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear ${name},</p>
        
        <p style="color: #4b5563; line-height: 1.6;">We detected a new login to your SkillBridge account. Here are the details:</p>

        <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 8px 0; color: #4b5563;">
            <strong>Time:</strong> ${time}
          </p>
          <p style="margin: 8px 0; color: #4b5563;">
            <strong>Location:</strong> ${location}
          </p>
          <p style="margin: 8px 0; color: #4b5563;">
            <strong>Device:</strong> ${device}
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">If this was you, you can ignore this email. If you did not log in at this time, please:</p>
        
        <ol style="color: #4b5563; line-height: 1.6;">
          <li>Change your password immediately</li>
          <li>Enable two-factor authentication if not already enabled</li>
          <li>Contact our support team</li>
        </ol>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${process.env.FRONTEND_URL}/settings/security" 
             style="background-color: #1a56db; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
            Review Security Settings
          </a>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
        <p style="margin: 5px 0;">This is an automated security alert.</p>
      </div>
    </div>
  `;

  return sendEmail({ 
    to: email, 
    subject, 
    html,
    text: `New login detected to your SkillBridge account. Time: ${time}, Location: ${location}, Device: ${device}. If this wasn't you, please change your password immediately.`
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, { name, resetUrl }) => {
  const subject = "Reset Your SkillBridge Password";
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; border-radius: 10px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a56db; margin: 0; font-size: 24px;">SkillBridge</h1>
        <p style="color: #6b7280; margin-top: 5px;">Password Reset Request</p>
      </div>

      <!-- Main Content -->
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear ${name},</p>
        
        <p style="color: #4b5563; line-height: 1.6;">We received a request to reset your password for your SkillBridge account. To proceed with the password reset, please click the button below:</p>

        <!-- Reset Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" 
             style="background-color: #1a56db; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
            Reset Password
          </a>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">For security reasons, this password reset link will expire in <strong>1 hour</strong>. If you did not request this password reset, please ignore this email or contact our support team immediately.</p>

        <!-- Alternative Link -->
        <div style="margin: 25px 0; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 0; color: #4b5563; font-size: 14px;">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; margin: 8px 0 0 0; color: #1a56db; font-size: 14px;">${resetUrl}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
        <p style="margin: 5px 0;">This is an automated message, please do not reply.</p>
      </div>
    </div>
  `;

  return sendEmail({ 
    to: email, 
    subject, 
    html,
    text: `Reset your SkillBridge password. Please visit: ${resetUrl}. This link will expire in 1 hour.`
  });
};
 
module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
};

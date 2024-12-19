import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

// Generic email sending function
const sendEmail = async ({ to, subject, text, html }: EmailOptions): Promise<boolean> => {
    try {
        const mailOptions = {
            from: `"SkillBridge" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Send OTP email
const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
    const subject = 'SkillBridge - Verify Your Email';
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
const sendWelcomeEmail = async (email: string, firstName: string): Promise<boolean> => {
    const subject = 'Welcome to SkillBridge! ';
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

    return await sendEmail({ to: email, subject, text: `Welcome to SkillBridge, ${firstName}!`, html });
};

export const emailService = {
    sendEmail,
    sendOTPEmail,
    sendWelcomeEmail
};

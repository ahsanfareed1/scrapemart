const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  // This allows you to set a custom "from" name
  // Note: Gmail will still show the actual Gmail address, but we can set the display name
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Send welcome email
const sendWelcomeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: '"ScrapeMart" <scrapemart@gmail.com>', // Gmail shows actual address
    to: toEmail,
    subject: 'Welcome to ScrapeMart! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #134575 0%, #1e9b96 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #1e9b96; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ScrapeMart!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Thank you for signing up! We're excited to have you on board.</p>
            <p>With ScrapeMart, you can:</p>
            <ul>
              <li>Extract product data from Shopify stores</li>
              <li>Scrape WooCommerce websites</li>
              <li>Export data in multiple formats</li>
              <li>Use advanced filtering options</li>
            </ul>
            <p>Get started now and scrape your first store!</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy scraping!</p>
            <p><strong>The ScrapeMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ScrapeMart. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', toEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (toEmail, resetUrl, userName) => {
  const mailOptions = {
    from: '"ScrapeMart" <scrapemart@gmail.com>', // Gmail shows actual address
    to: toEmail,
    subject: 'Reset Your Password - ScrapeMart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #134575 0%, #1e9b96 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #1e9b96; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName || 'there'},</h2>
            <p>We received a request to reset your password for your ScrapeMart account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1e9b96;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <p><strong>The ScrapeMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ScrapeMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', toEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send team invitation email
const sendTeamInvitationEmail = async (toEmail, inviterName, inviterEmail, teamRole, acceptUrl) => {
  // Use provided URL or generate default
  const invitationUrl = acceptUrl || `${process.env.CLIENT_URL || 'http://localhost:3000'}/accept-team-invitation?email=${encodeURIComponent(toEmail)}`;
  
  const mailOptions = {
    from: '"ScrapeMart" <scrapemart@gmail.com>', // Gmail shows actual address
    to: toEmail,
    subject: `You've been invited to join ${inviterName}'s team on ScrapeMart`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #134575 0%, #1e9b96 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #1e9b96; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Team Invitation</h1>
          </div>
          <div class="content">
            <h2>You've been invited!</h2>
            <p><strong>${inviterName}</strong> (${inviterEmail}) has invited you to join their team on ScrapeMart.</p>
            
            <div class="info-box">
              <p><strong>Your Role:</strong> ${teamRole}</p>
              <p>As a team member, you'll have access to shared projects and can collaborate on scraping tasks.</p>
            </div>

            <p>Click the button below to accept the invitation and access your team:</p>
            <a href="${invitationUrl}" class="button">Accept Invitation</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1e9b96;">${invitationUrl}</p>
            
            <p>If you don't want to accept this invitation, you can safely ignore this email.</p>
            
            <p><strong>The ScrapeMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ScrapeMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Team invitation email sent to:', toEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending team invitation email:', error);
    return { success: false, error: error.message };
  }
};

// Send email verification
const sendVerificationEmail = async (toEmail, verificationToken, userName) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: '"ScrapeMart" <scrapemart@gmail.com>', // Gmail shows actual address
    to: toEmail,
    subject: 'Verify Your Email - ScrapeMart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #134575 0%, #1e9b96 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #1e9b96; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Thank you for signing up for ScrapeMart! Please verify your email address to get started.</p>
            <a href="${verifyUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1e9b96;">${verifyUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with ScrapeMart, please ignore this email.</p>
            <p><strong>The ScrapeMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ScrapeMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', toEmail);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendTeamInvitationEmail,
  sendVerificationEmail
};


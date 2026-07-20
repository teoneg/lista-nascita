import nodemailer from 'nodemailer';

// Configure SMTP transport for Gmail
// Requires environment variables: GMAIL_USER and GMAIL_APP_PASSWORD
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendCodeEmail(email: string, code: string) {
  // If credentials are not set (e.g. local dev without env vars), just log the code
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[DEV MODE] Email to ${email}: Your code is ${code}`);
    return { success: true };
  }

  try {
    const mailOptions = {
      from: `"Lista Nascita" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Il tuo codice di accesso',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #3D2C2E; background-color: #FFF9F5;">
          <h1 style="color: #D4728E;">Il tuo codice di accesso</h1>
          <p>Usa questo codice per accedere alla nostra lista nascita:</p>
          <div style="background-color: #FFF0F3; padding: 15px; border-radius: 8px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
            ${code}
          </div>
          <p style="margin-top: 20px; color: #7A6365;">A presto!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, data: info };
  } catch (error: any) {
    console.error('Error sending email via Nodemailer:', error);
    return { success: false, error: error.message || String(error) };
  }
}


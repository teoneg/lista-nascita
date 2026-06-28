import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_example');

export async function sendCodeEmail(email: string, code: string) {
  // If no API key is set (e.g. local dev without env vars), just log the code
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] Email to ${email}: Your code is ${code}`);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Lista Nascita <onboarding@resend.dev>',
      to: [email],
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
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message || JSON.stringify(error) };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Exception sending email:', error);
    return { success: false, error: error.message || String(error) };
  }
}

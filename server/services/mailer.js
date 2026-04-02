import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
};

export const sendPortfolioMessage = async ({ name, email, subject, message }) => {
  if (!process.env.SMTP_HOST || !process.env.MAIL_TO) return;

  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;">
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;white-space:pre-wrap;">${message}</div>
      </div>
    `
  });
};

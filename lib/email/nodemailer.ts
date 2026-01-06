import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendRSVPNotification(data: {
  name: string;
  email: string;
  attending: boolean;
  guestCount: number;
  message?: string;
}) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New RSVP: ${data.name} - ${data.attending ? 'Attending' : 'Not Attending'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b21a8;">New RSVP Submission</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Attending:</strong> ${data.attending ? 'Yes ✅' : 'No ❌'}</p>
          <p><strong>Number of Guests:</strong> ${data.guestCount}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendUploadNotification(data: {
  caption: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  imageUrl: string;
}) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Photo Uploaded to Wedding Gallery',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b21a8;">New Photo Upload</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p><strong>Caption:</strong> ${data.caption}</p>
          ${data.guestName ? `<p><strong>Guest Name:</strong> ${data.guestName}</p>` : ''}
          ${data.guestEmail ? `<p><strong>Email:</strong> ${data.guestEmail}</p>` : ''}
          ${data.guestPhone ? `<p><strong>Phone:</strong> ${data.guestPhone}</p>` : ''}
          <p><strong>Image URL:</strong> <a href="${data.imageUrl}">${data.imageUrl}</a></p>
          <img src="${data.imageUrl}" alt="Uploaded photo" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

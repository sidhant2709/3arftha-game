import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, text) => {
  console.log("process.env.EMAIL_SERVICE",process.env.EMAIL_SERVICE)
  console.log("process.env.EMAIL_USERNAME",process.env.EMAIL_USERNAME)
  console.log("process.env.EMAIL_PASSWORD",process.env.EMAIL_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

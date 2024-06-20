import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to:string, html:string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'ibrahimsikder5033@gmail.com',
      pass: 'bheb owyn erof xnpe',
    },
  });

  await transporter.sendMail({
    from: 'ibrahim.sikder.dev@gmail.com',
    to,
    subject: 'Reset your password within 10m',
    text: 'Hello world?',
    html,
  });
};

import { log } from 'console';
import { config } from 'dotenv';
import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { generate } from 'randomstring';

config();

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.APP_PASSWORD,
  },
});

export async function sendMail(email: string): Promise<string> {
  const OTP: string = generate({ length: 4, charset: 'hex' });
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Hello',
    text: `Verification code is ${OTP} don't share it`,
  };
  transport.sendMail(mailOptions, err => (err ? log(err) : log('OTP sent successfully')));
  return OTP;
}

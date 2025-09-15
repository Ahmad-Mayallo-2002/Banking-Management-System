import { log } from 'console';
import { config } from 'dotenv';
import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { generate } from 'randomstring';
import mjml2html from 'mjml';
import { mjmlTemplate } from '../emailTemplate/verification-code';

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
  const finalMjml = mjmlTemplate.replace('{{code}}', OTP);
  const { html } = mjml2html(finalMjml);
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Your Password Reset Code',
    html,
  };
  transport.sendMail(mailOptions, err => (err ? log(err) : log('OTP sent successfully')));
  return OTP;
}

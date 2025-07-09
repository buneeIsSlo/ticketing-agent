import nodemailer from "nodemailer";
import { greenBright, redBright } from "yoctocolors";

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.enve.MAILTRAP_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Inngest TMS",
      to,
      subject,
      text,
    });

    console.log(greenBright("Message sent:", info.messageId));
    return info;
  } catch (error) {
    console.error(redBright("Mail error: ", error.message));
  }
};

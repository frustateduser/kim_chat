import nodemailer from "nodemailer";
import fs from "fs-extra";
import juice from "juice";
import path from "path";
import logger from "./logger.js";
import { fileURLToPath } from "url";

export async function sendVerificationEmail(toEmail, userName, otpCode) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const htmlPath = path.resolve(__dirname, "../email/signupTemplate.html");
    const cssPath = path.resolve(__dirname, "../email/signupTemplate.css");

    let html = await fs.readFileSync(htmlPath, "utf-8");
    const css = await fs.readFileSync(cssPath, "utf-8");

    html = html
      .replace(/{{userName}}/g, userName)
      .replace(/{{OTP_CODE}}/g, otpCode)
      .replace(/{{year}}/g, new Date().getFullYear());

    const inlinedHtml = juice.inlineContent(html, css);

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KIM CHAT" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Verify your email address",
      html: inlinedHtml,
      attachments: [
        {
          filename: "kim.png",
          path: path.resolve(__dirname, "../email/kim.png"),
          cid: "logo@kimchat",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent:", info.response);
  } catch (error) {
    logger.error("Error sending email:", error);
  }
}

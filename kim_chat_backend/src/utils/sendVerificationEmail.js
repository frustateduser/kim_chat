import nodemailer from "nodemailer";
import fs from "fs-extra";
import juice from "juice";
import path from "path";
import logger from "./logger.js";

export async function sendVerificationEmail(toEmail, userName, otpCode) {
  try {
    const __dirname = path.resolve();
    const htmlPath = path.join(__dirname, "src", "email", "signupTemplate.html");
    const cssPath = path.join(__dirname, "src", "email", "signupTemplate.css");

    let html = await fs.readFile(htmlPath, "utf-8");
    const css = await fs.readFile(cssPath, "utf-8");

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
          path: path.join(__dirname, "src", "email", "kim.png"),
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

import nodemailer from "nodemailer";
import fs from "fs-extra";
import path from "path";
import juice from "juice";
import logger from "../utils/logger.js";

export async function sendPasswordResetEmail(toEmail, username, otp) {
  try {
    const htmlPath = path.join(process.cwd(), "src", "email", "passwordReset.html");
    const cssPath = path.join(process.cwd(), "src", "email", "passwordReset.css");

    let html = await fs.readFile(htmlPath, "utf-8");
    const css = await fs.readFile(cssPath, "utf-8");

    html = html
      .replace(/{{USERNAME}}/g, username)
      .replace(/{{RESET_OTP}}/g, otp)
      .replace(/{{YEAR}}/g, new Date().getFullYear());

    const inlinedHtml = juice.inlineContent(html, css);

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Kim Chat" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Reset your Kim Chat password",
      html: inlinedHtml,
      attachments: [
        {
          filename: "kim.png",
          path: path.join(process.cwd(), "src", "email", "kim.png"),
          cid: "kimlogo@cid",
        },
      ],
    });

    logger.info(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    logger.error("Error sending password reset email:", error);
  }
}

import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: (process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // 2️⃣ Email options
    const mailOptions = {
      from: `"Interview Platform" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text
    };

    // 3️⃣ Send mail
    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;

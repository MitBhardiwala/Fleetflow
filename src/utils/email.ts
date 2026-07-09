import nodemailer from "nodemailer";

// Define the interface for the mail options
interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// 1. Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for port 465, false for other ports like 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Export the utility function to send emails
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const mailOptions = {
    from: "Logistisc && FLeet management team", // Sender identity
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Dispatch the email asynchronously
  await transporter.sendMail(mailOptions);

  console.log("Mail sent successfully to : ", options.to);
};

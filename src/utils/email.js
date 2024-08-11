import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: `sandbox.smtp.mailtrap.io`,
    port: 2525,
    auth: {
      user: `222d310d4e0b61`,
      pass: `63ce7a8f238d30`,
    },
  });

  //   EMAIL_USERNAME=222d310d4e0b61
  // EMAIL_PASSWORD=63ce7a8f238d30
  // EMAIL_HOST=sandbox.smtp.mailtrap.io
  // EMAIL_PORT=2525

  // 2) Define the email options
  const mailOptions = {
    from: "Jonas Schmedtmann <hello@jonas.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export { sendEmail };

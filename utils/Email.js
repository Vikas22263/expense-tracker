import nodemailer from "nodemailer";

const setupNodeMailer = () => {
  return nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "97ec445524556d",
      pass: "f5834a883560b4",
    },
  });
};

const Mailsender = async (resetUrl, email, username) => {
  try {
    const transporter = setupNodeMailer();

    const mailOptions = {
      from: "your-email@gmail.com", 
      to: email,
      subject: "Password Reset",
      text: `Hello ${username},\n\nPlease click on the following link to reset your password:\n${resetUrl}\.`,
    };

    const eamil=await transporter.sendMail(mailOptions);
   
    console.log("Email sent successfully!");
    return eamil
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default Mailsender;

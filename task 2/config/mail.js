import nodemailer from "nodemailer"
const transporter =nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
   const sendEmail = async (to, subject, text) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    });
    return {
        message: "Email sent successfully",
        messageId: info.messageId
    }
}
export default sendEmail;
const nodemailer = require("nodemailer");
const { verifyaccountMailgen, verifyaccoutbodyGenrator } = require("./mail_template");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOSTNAME_TEST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME_TEST,
      pass: process.env.SMTP_PASSWORD_TEST,
    },
  });

 async function sendverifymail(tomail,username,token) {
    let emailBody = verifyaccountMailgen.generate(verifyaccoutbodyGenrator(username,token));
let emailText = verifyaccountMailgen.generatePlaintext(verifyaccoutbodyGenrator(username,token));
    try {
    const info = await transporter.sendMail({
      from: '" 👻" <hi@demomailtrap.co>',
      to: tomail,
      subject: "Verify Account",
      text: emailText,
      html: emailBody,
    });
    } catch(err) {
        console.log("unable to send mail ", err);
    }
}


module.exports = sendverifymail
const nodemailer = require("nodemailer");
const { verifyaccountMailgen, verifyaccoutbodyGenrator, resetPasswordBodyGenrator, forgotPasswordBodyGenrator } = require("./mail_template");


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOSTNAME_TEST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME_TEST,
    pass: process.env.SMTP_PASSWORD_TEST,
  },
});

async function sendverifymail(tomail, username, token) {
  if (!tomail || !username || !token) {
    return new Error("All parmeter are required : tomail, username, token");
  }
  let emailBody = verifyaccountMailgen.generate(verifyaccoutbodyGenrator(username, token));
  let emailText = verifyaccountMailgen.generatePlaintext(verifyaccoutbodyGenrator(username, token));
  try {
    const info = await transporter.sendMail({
      from: '" 👻" <hi@demomailtrap.co>',
      to: tomail,
      subject: "Verify Account",
      text: emailText,
      html: emailBody,
    });
    return true;
  } catch (err) {
    console.log("unable to send mail ", err);
    return false;
  }
}

async function sendResetPasswordMail(tomail, username, token) {
  if (!tomail || !username || !token) {
    return new Error("All parmeter are required : tomail, username, token");
  }
  let emailBody = verifyaccountMailgen.generate(resetPasswordBodyGenrator(username, token));
  let emailText = verifyaccountMailgen.generatePlaintext(resetPasswordBodyGenrator(username, token));

  try {
    const info = await transporter.sendMail({
      from: '" 👻" <hi@demomailtrap.co>',
      to: tomail,
      subject: "Reset Password",
      text: emailText,
      html: emailBody,
    });
    return true;
  } catch (err) {
    console.log("unable to send reset password mail : ", err);
    return false;
  }
}

async function sendForgotPasswordMail(tomail, username, token) {
  if (!tomail || !username || !token) {
    return new Error("All parmeter are required : tomail, username, token");
  }
  let emailBody = verifyaccountMailgen.generate(forgotPasswordBodyGenrator(username, token));
  let emailText = verifyaccountMailgen.generatePlaintext(forgotPasswordBodyGenrator(username, token));
  try {
    const info = await transporter.sendMail({
      from: '" 👻" <hi@demomailtrap.co>',
      to: tomail,
      subject: "Forgot Password",
      text: emailText,
      html: emailBody,
    });
    return true;
  } catch (err) {
    console.log("unable to send forgot password mail : ", err);
    return false
  }
}

module.exports = { sendverifymail, sendResetPasswordMail, sendForgotPasswordMail }
const User = require("../model/user.model");
const sendverifymail = require("../utils/send_mail");
const { generateVerifyToken, verifyToken, generateLoginToken } = require("../utils/verify_token");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "body data is missing",
            success: false,
        });
    }
    const { firstName, lastName, username, phNum, mail, password } = req.body;
    if (
        firstName === undefined || firstName === null ||
        lastName === undefined || lastName === null ||
        username === undefined || username === null ||
        phNum === undefined || phNum === null || phNum.length !== 10 ||
        mail === undefined || mail === null ||
        password === undefined || password === null
    ) {
        return res.status(400).json({
            message: "All details are required",
            success: false,
        });
    }

    try {


        const findByUsername = await User.findOne({
            username
        });
        const findByphNum = await User.findOne({
            phNum
        });
        const findBymail = await User.findOne({
            mail
        });
        if (findByUsername || findBymail || findByphNum) {
            return res.status(400).json({
                message: "Username, Email, or Phone Number already taken",
                success: false
            })
        } else {
            const verifyToken = generateVerifyToken(mail);
            const userCreated = await User.create({ firstName, lastName, username, phNum, mail, password, verifyToken });
            if (userCreated) {
                sendverifymail(mail, firstName, verifyToken);
                console.log("user created : ", userCreated);
                return res.status(201).json({
                    message: "User created",
                    success: true
                })
            } else {
                return res.status(400).json({
                    message: "unable to create user",
                    success: false
                })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong",
            success: false,
            error: err
        })
    }
}

const verifyUser = async (req, res) => {
    try {
    if (!req.params.token) {
        return res.status(400).json({
            message: "token required",
            success: false
        })

    }
    if (req.params.token) {
        const decoded = verifyToken(req.params.token, process.env.JWT_SECRET)
        if (decoded) {
            await User.findOneAndUpdate(
                { mail: decoded.mail },
                { isVerify: true, verifyToken: null }
            )
            res.status(200).json({
                message: "user verified",
                success: true
            })
        } else {
            res.status(400).json({
                message: "failed to verify, either token expired or invalid token",
                success: false
            })
        }
    }
} catch(err) {
    console.log("error in verifyUser controller : ", err);
}
}

const loginUser = async (req, res) => {
    try {


    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'All fields are required are required.' });
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await User.findOne({
        [isEmail ? 'mail' : 'username']: identifier
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials", success: false })
    }

    const ispasswordMatch = await bcrypt.compare(password, user.password);
    if (!ispasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials', success: false });
    }
    if (!user.isVerify) {
return res.status(400).json(
    {
    message: "Unveried profile, verify your profile first",
    success: false
})
    }
const token = generateLoginToken(user._id);

       res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

     return res.status(200).json({
        message: "login done",
        success: true,
        user : {
            username: user.username,
            mail: user.mail,
            verify: user.isVerify
        }
      })

    } catch (err) {
        console.log("error in login controller : ", err);
    }
}

const resendMail = async (req,res) => { // also make new verification token
    try {
 const {mail} = req.body;
 if (!mail) {
 return res.status(400).json({
    message: "mail is required",
    success: false
 })
}

const findBymail = await User.findOne({
    mail
})
if (!findBymail) {
    return res.status(400).json({
        message: "no user found , register yourself first",
        success: false
    })
}

const token = generateVerifyToken(mail);
findBymail.verifyToken = token;
await findBymail.save();
const firstName = findBymail.firstName;
const isMailSend = await sendverifymail(mail, firstName, token);
if (!isMailSend) {
return res.status(400).json({
    message: "fail to send mail , try again",
    success: false
})
}

res.status(200).json({
    message: "mail sent successfully",
    success: true
})
} catch(err) {
    console.log("error in resend mail : ", err);
}
}
module.exports = { registerUser, verifyUser, loginUser, resendMail }
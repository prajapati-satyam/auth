const User = require("../model/user.model");
const sendverifymail = require("../utils/send_mail");
const { generateVerifyToken, verifyToken } = require("../utils/verify_token");
const jwt = require('jsonwebtoken');

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
                sendverifymail(mail,firstName,verifyToken);
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
                {mail: decoded.mail},
                {isVerify: true}
            )
            res.status(200).json({
                message: "user verified",
                success: true
            })
        } else {
            res.status(400).json({
                message: "failed to verify",
                success: false
            })
        }
    }
}

module.exports = { registerUser, verifyUser }
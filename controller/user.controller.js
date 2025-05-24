const User = require("../model/user.model");
const {sendverifymail, sendResetPasswordMail, sendForgotPasswordMail} = require("../utils/send_mail");
const { generateVerifyToken, verifyToken, generateLoginToken, generateResetPasswordToken, generateForgotPasswordToken } = require("../utils/verify_token");
const upload = require('../middleware/file.upload.multer.middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const imagekit = require("../utils/imgkit");
const fs = require('fs');

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
                    { isVerify: true, verifyToken: "user verified" }
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
    } catch (err) {
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
            user: {
                username: user.username,
                mail: user.mail,
                verify: user.isVerify
            }
        })

    } catch (err) {
        console.log("error in login controller : ", err);
    }
}

const resendMail = async (req, res) => { // also make new verification token
    try {
        const { mail } = req.body;
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
    } catch (err) {
        console.log("error in resend mail : ", err);
    }
}

const profile = async (req, res) => {
    console.log(req.user);
    const userId = req.user;
    try {
        const finduser = await User.findOne({ _id: userId });
        console.log(finduser);
        if (!finduser) {
            return res.status(400).json({
                message: "either no data found or your are not logged in",
                success: false
            })
        }
        const { firstName, lastName, username, phNum, mail, isVerify } = finduser;
        res.status(200).json({
            message: "data found",
            success: true,
            user: {
                firstName,
                lastName,
                username,
                phNum,
                mail,
                isVerify
            }
        })
    } catch (err) {
        console.log("error in profile controller : ", err);

    }
}

const resetPasswordRequest = async(req,res) => {
const userId = req.user;
try {
const finduser = await User.findOne({_id: userId});
if (!finduser) {
    return res.status(400).json({
        message: "no data found",
        success: false
    })
}
 const token = generateResetPasswordToken(userId);
finduser.resetPasswordToken = token;
finduser.save();
const isMailSend = await sendResetPasswordMail(finduser.mail, finduser.username, token);
if(!isMailSend) {
    return res.status(400).json({
        message: "unable to send mail",
        success: false
    })
}
res.status(200).json({
    message: "Reset password Mail sent",
    success: true
})

} catch (err) {
    console.log("error in resetPasswordRequest controller : ", err);
}
}

const verifyResetPasswordAndUpdate = async (req,res) => {
    const token = req.query.token;
    if(!token) {
        return res.status(400).json({
            message: "invalid link",
            success: false
        })
    }
    if(!req.body) {
return res.status(400).json({
    message: "body must be required",
    success: false
})
    }
    const {oldpassword, password, cnpassword} = req.body;
    if (!oldpassword || !password || !cnpassword) {
        return res.status(400).json({
            message: "all fileds are required",
            success: false
        })
    }
    if(password !== cnpassword) {
       return res.status(400).json({
        message: "new password and confirm password not match",
        success: false
       })
    }
    console.log(token)
    try {
        const isValid = jwt.verify(token, process.env.JWT_SECRET);
        const finduser = await User.findOne({
            resetPasswordToken: token
        })
        const verify_oldpassword = await bcrypt.compare(oldpassword, finduser.password);
        if (!verify_oldpassword) {
    return res.status(400).json({
        message: "old password does not match, you can use forgot password",
        success: false
    })
        }
        finduser.password = cnpassword;
        finduser.resetPasswordToken = null;
        finduser.save();
        res.status(400).json({
            message: "password updated done",
            success: true
        })
    } catch(err) {
        console.log("failed to verify : ", err);
        return res.status(400).json({
            message: "either link expire or invalid , try with new one",
            success: false
         })
    }

}

const forgotPasswordRequest = async (req,res) => {

    const {mail} = req.body;
    if (!mail) {
return res.status(400).json({
    message: "mail is required",
    success: false
})
    }
    try {
const finduser = await User.findOne({mail});
if (!finduser) {
    return re.status(400).json({
        message: "no user found , check your mail and try again with correct mail",
        success: false
    })
}
const token = generateForgotPasswordToken(finduser._id);
finduser.forgotPasswordToken = token;
await finduser.save();
const isMailSend = await sendForgotPasswordMail(mail,finduser.username,token);
if (!isMailSend) {
    return res.status(400).json({
        message: "failed to sent mail on register mail address",
        success: false
    })
}
res.status(200).json({
    message: "mail sent",
    success: true
})

    } catch (err) {
        console.log("error in forgot password requets : ", err);
        res.status(400).json({
            message: "uanble to send mail , try again",
            success: false
        })
    }

}

const verifyForgotPasswordAndUpdate = async (req,res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({
        message: "invalid link",
        success: false
        })
            }
            if(!req.body) {
                return res.status(400).json({
                    message: "body must be required", success: false
                })
            }
    const {password, cnpassword} = req.body;
    if (!password || !cnpassword) {
return res.status(400).json({
    message: "all fields are required",
    success: false
})
}
if (password !== cnpassword) {
    return res.status(400).json({
        message: "password and confirm password mismatch",
        success: false
    })
    }
    try {
        const isValid = jwt.verify(token, process.env.JWT_SECRET);
        const finduser = await User.findOne(({forgotPasswordToken: token}));
        finduser.password = password;
        finduser.forgotPasswordToken = null;
        await finduser.save();
        res.status(200).json({
            message: "Password updated successfully",
            success: true
        })
    } catch(err) {
        console.log("failed to verify token : ", err);
        res.status(400).json({
            message: "link expired, try with new one",
            success: false
        })
    }
}

const profile_upload = async (req,res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "file required",
            success: false
        })
    }
        try {
            if (!req.cookies.token) {
                return res.status(400).json({
                    message: "login required for upload image",
                    success: false
                })
            }
            try {
            const isVerify = verifyToken(req.cookies.token);
            const userId = isVerify.userId;
            const findUser = await User.findOne({_id: userId});
            if(!findUser) {
                return res.status(400).json({
                    message: "no user found",
                    success: false
                })
            }
            try {
             const filePath = req.file.path;
     const result = await imagekit.upload({
        file: fs.createReadStream(filePath),
        fileName: req.file.originalname,
        folder: "/profile_picture",
     })
     fs.unlinkSync(req.file.path);
     findUser.profilePictureUrl = result.url;
     findUser.save();
     console.log(result);
     console.log(findUser)
     res.status(200).json({
        message: "file upload done",
        success: true,
        url: result.url
     })
    } catch (err) {
        return res.status(400).json({
            message: "unable to upload image",
            success:false
        })
     }
        } catch (err) {
             return res.status(400).json({
                message: "login expired , login again to upload image",
                success: false
             })
        }
    } catch(err) {
        console.log("failed to upload file : ",err);
         return res.status(400).json({
            messsage: "file upload failed",
            success: false
        })
    }
}

module.exports = { registerUser, verifyUser, loginUser, resendMail, profile , resetPasswordRequest, verifyResetPasswordAndUpdate, forgotPasswordRequest, verifyForgotPasswordAndUpdate, profile_upload}
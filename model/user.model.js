require('dotenv').config()
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const user = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "firstname is required"]
        },
        lastName: {
            type: String,
            required: [true, "lastname is required"]
        },
        username: {
            type: String,
            required: [true, "username is required"],
            unique: [true, "username is already taken"],
            lowercase: true,
        },
        phNum: {
            type: String,
            required: [true, "phone number is required"],
            unique: [true, "Mobile number is already in use"]
        },
        mail: {
            required: [true, "mail is required"],
            type: String,
            unique: [true, "email is already in use"],
            lowercase: true
        },
        password: {
            required: [true, "password is required"],
            type: String
        },
        verifyToken: {
            required: [true, "verify token not genrated"],
            type: String
        },
        resetPasswordToken: {
            type: String
        },
        forgotPasswordToken: {
            type: String
        },
        isVerify: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


user.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt_value = Number(process.env.SALT)
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



const User = mongoose.model("userDetail", user);

module.exports = User





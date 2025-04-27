const mongoose = require("mongoose");

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
            required: true,
            type: String
        },
        isVerify: {
            required: true,
            type: Boolean,
            default: false
        }
    }
);



const { json } = require('express');
const jwt = require('jsonwebtoken');

const verifyLoginToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({
            message: "no token found , login to get profile info",
            success: false
        })
    }
    try {
        const isValid = jwt.verify(token, process.env.JWT_SECRET);
        if (isValid) {
            req.user = isValid.userId;
            next()
        } else {
            return res.status(400).json({
                message: "fail to verify , try again",
                success: false
            })
        }

    } catch (err) {
        console.log("error in middleware of verify login token : ", err);
        return res.status(400).json({
            message: "error in verifation , try again",
            success: false
        })
    }
}


module.exports = {verifyLoginToken}
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function generateVerifyToken(mail) {
    const token = jwt.sign(
        { mail },
        SECRET,
        { expiresIn: '5m' }
    );
    return token;
}

function verifyToken(token) {
    if (!token) {
        throw new Error("token parmerter is required")
    } else {

        try {
            const decoded = jwt.verify(token, SECRET);
            return decoded;
        } catch (err) {
            console.log("unable to verify token", err);
            return false;
        }
    }

}

function generateLoginToken(userid) {
    const token = jwt.sign(
        { userId: userid },
        SECRET,
        { expiresIn: '1d' });
       return token

}

module.exports = { generateVerifyToken, verifyToken, generateLoginToken }

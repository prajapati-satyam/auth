const Mailgen = require('mailgen');

const verifyaccountMailgen = new Mailgen({
    theme: 'salted',
    product: {
        name: 'spideys',
        link: 'https://facebook.com'
    }
});


const verifyaccoutbodyGenrator = (username, token) => {
    const verifyLink = `https://auth-cpgr.onrender.com/verify/${token}`; // Replace with your actual domain
    return {
        body: {
            name: username,
            intro: 'Welcome to our platform! We\'re very excited to have you on board.',
            action: {
                instructions: 'To verify your account, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Verify Your Account',
                    link: verifyLink
                }
            },
            outro: `Need help, or have questions? Just reply to this email, we\'d love to help.`
        }
    };
}

const resetPasswordBodyGenrator = (username, token) => {
    const verifyLink = `https://auth-cpgr.onrender.com/reset-password/update?token=${token}`
    return {
        body : {
name: username,
intro: 'Reset password request',
action:{
    instructions: 'To reset your account password, please click here',
    button: {
        color: '#ff5050',
        text: 'Reset password',
        link: verifyLink
    }
},
outro: `If request is not placed by you, \n you can ignore it, \ no need to worry`
        }
    }
}

const forgotPasswordBodyGenrator = (username, token) => {
    const verifyLink = `https://auth-cpgr.onrender.com/forgot-password/update?token=${token}`
    return {
        body : {
name: username,
intro: 'Forgot password request',
action:{
    instructions: 'To Forgot your account password, please click here',
    button: {
        color: '#ff5050',
        text: 'Forgot password',
        link: verifyLink
    }
},
outro: `If request is not placed by you, \n you can ignore it, \ no need to worry`
        }
    }
}


module.exports = {verifyaccountMailgen, verifyaccoutbodyGenrator, resetPasswordBodyGenrator, forgotPasswordBodyGenrator}
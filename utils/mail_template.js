const Mailgen = require('mailgen');

const verifyaccountMailgen = new Mailgen({
    theme: 'salted',
    product: {
        name: 'spideys',
        link: 'https://facebook.com'
    }
});


const verifyaccoutbodyGenrator = (username, token) => {
    const verifyLink = `https://yourdomain.com/verify/${token}`; // Replace with your actual domain
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


module.exports = {verifyaccountMailgen, verifyaccoutbodyGenrator}
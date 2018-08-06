// The following environment variables are set by app.yaml (app.flexible.yaml or
// app.standard.yaml) when running on Google App Engine,
// but will need to be manually set when running locally.
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER;
const Sendgrid = require('sendgrid')(SENDGRID_API_KEY);
const mailHtml = require('./mailHtml');

module.exports = {
    sendPasswordRecoveryEmail,
    sendNewUserEmail,
    sendAward
};

function sendPasswordRecoveryEmail(userEmail, encryptedEmail, token, callBack) {
    const html = mailHtml.passwordRecoveryEmail(encryptedEmail, token);
    const sgReq = Sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [{
                to: [{email: userEmail}],
                subject: 'Password Recovery'
            }],
            from: {email: SENDGRID_SENDER},
            content: [{
                type: 'text/html',
                value: html
            }]
        }
    });

    Sendgrid.API(sgReq, (err) => {
        callBack(err);
    });
}

function sendNewUserEmail(user) {
    let html = mailHtml.newUserHtml(user.password);
    const sgReq = Sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [{
                to: [{email: user.email}],
                subject: 'Account Created'
            }],
            from: {email: SENDGRID_SENDER},
            content: [{
                type: 'text/html',
                value: html
            }]
        }
    });

    Sendgrid.API(sgReq, (err) => {
        if (err) {
            console.log("Failed to send new user email to " + user.email, err);
        } else {
            console.log("New user email sent to " + user.email);
        }
    });
}

function sendAward() {

}
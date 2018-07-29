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

function sendPasswordRecoveryEmail(userEmail, userPassword, callBack) {
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
                type: 'text/plain',
                value: `Your password is ${userPassword}.`
            }]
        }
    });

    Sendgrid.API(sgReq, (err) => {
        callBack(err);
    });
}

function sendNewUserEmail(user) {
    let email = new Sendgrid.Email();
    email.addTo(user.email);
    email.setFrom(SENDGRID_SENDER);
    email.setSubject("Welcome to Employee Awards!");

    let html = mailHtml.newUserHtml(user.password);
    email.setHtml(html);

    Sendgrid.send(email, (err, result) => {
        if (err) {
            console.log("New user email sent to " + user.email, result);
        } else {
            console.log("Failed to send new user email to " + user.email, result);
        }
    });
}

function sendAward() {

}
// The following environment variables are set by app.yaml (app.flexible.yaml or
// app.standard.yaml) when running on Google App Engine,
// but will need to be manually set when running locally.
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER;
const Sendgrid = require('sendgrid')(SENDGRID_API_KEY);

module.exports = {
    sendPasswordRecoveryEmail,
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

function sendAward() {

}
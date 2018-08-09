

module.exports = {
    passwordRecoveryEmail,
    newUserHtml
};

function passwordRecoveryEmail(encryptedEmail, token) {
    return `
      <div>
        <p>Click the button below to update your password. The link is only available to 24 hours and can be used only once.</p>
        <br>
        <a style="padding: 10px; background-color: #b56969; border: none; border-radius: 5px; margin: 10px; color: #e8edf3; text-decoration: none;"
         href="https://employee-rewards-front-end.appspot.com/#/updatePassword?e=${encryptedEmail}&t=${token}">Update Password</a>
      </div>
    `;
}

function newUserHtml(userPassword) {
    return `
      <div>
        <h1>Welcome to the Employee Awards Portal</h1>
        <h3>Your account is setup and ready to go</h3>
        <p>Your password is ${userPassword}</p>
        <a href="https://employee-rewards-front-end.appspot.com/">Login</a>
      </div>
    `;
}

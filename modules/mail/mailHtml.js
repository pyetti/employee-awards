

module.exports = {
    passwordRecoveryEmail,
    newUserHtml
};

function passwordRecoveryEmail(userPassword) {
    return `
      <div>
        <h3>Your password is ${userPassword}</h3>
        <a href="https://employee-rewards-front-end.appspot.com/">Login</a>
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



module.exports = {
    newUserHtml
};

function newUserHtml(userPassword) {
    let html = `
  <div>
    <h1>Welcome to the Employee Awards Portal</h1>
    <h3>Your account is setup and ready to go</h3>
    <p>Your password is ${userPassword}
   </div>
  `;
}
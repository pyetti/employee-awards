const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hash,
    compare,
    compareSync
};

function hash(stringToHash, callBack) {
    bcrypt.hash(stringToHash, saltRounds, (err, hash) => {
        callBack(err, hash);
    });
}

function compare(plainText, hashedText, callBack) {
    bcrypt.compare(plainText, hashedText, (err, match) => {
        callBack(err, match);
    });
}

function compareSync(plainText, hashedText) {
    return bcrypt.compareSync(plainText, hashedText);
}

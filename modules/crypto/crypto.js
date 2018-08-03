'use strict';
// using http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/

const crypto = require('crypto'), algorithm = 'aes256', password = Math.random().toString(36).substring(2, 12);
const ENCRYPTION_KEY = 'dX?RA_)n7t;L*-Yzr4;r"Fjzdf{u+:&-'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

module.exports = {
    encrypt,
    decrypt
};

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

// function encrypt(data) {
//     const cipher = crypto.createCipher(algorithm, password);
//     let crypted = cipher.update(data, 'utf8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;
// }
//
// function decrypt(data) {
//     const decipher = crypto.createDecipher(algorithm, password);
//     let dec = decipher.update(data, 'hex', 'utf8');
//     dec += decipher.final('utf8');
//     return dec;
// }

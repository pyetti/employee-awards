'use strict';
// using http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = 'dX?RA_)n7t;L*-Yzr4;r"Fjzdf{u+:&-'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

module.exports = {
    encrypt,
    decrypt
};

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, new Buffer(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

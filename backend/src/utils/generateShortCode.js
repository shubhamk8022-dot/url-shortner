const crypto = require("crypto");

const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateShortCode = (length = 6) => {
    const randomBytes = crypto.randomBytes(length);

    let shortCode = "";

    for (let i = 0; i < length; i++) {
        shortCode += CHARACTERS[randomBytes[i] % CHARACTERS.length];
    }

    return shortCode;
};

module.exports = generateShortCode;
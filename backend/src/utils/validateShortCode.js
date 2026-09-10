const SHORT_CODE_REGEX = /^[A-Za-z0-9]{6}$/;

const validateShortCode = (shortCode) => {
    return SHORT_CODE_REGEX.test(shortCode);
};

module.exports = validateShortCode;
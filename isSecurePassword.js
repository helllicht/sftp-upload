const core = require('@actions/core');

/**
 * @param {string} password
 * @return {boolean}
 */
let isSecurePassword = function (password) {
    if (typeof password !== 'string') {
        core.setFailed('Password is not type string!');
        throw new Error('Error from passwordCheck.js - password is not type string!');
    }

    if (password.length < 8) {
        // it is checked in regex anyway, but for a probably better error message it is prechecked :)
        core.setFailed('Password is to short "password.length < 8"!');
        throw new Error('Error from passwordCheck.js - password is to short "password.length < 8"!');
    }

    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    if (!password.match(strongRegex)) {
        core.setFailed('Password is not complex enough!');
        throw new Error('Error from passwordCheck.js - password is not complex enough! (1 lowercase, 1 uppercase, 1 numeric, 1 special character [!@#$%^&*])');
    }
};

module.exports = isSecurePassword;

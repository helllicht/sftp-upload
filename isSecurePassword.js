const core = require('@actions/core');

/**
 * @param {string} password
 * @return {boolean}
 */
let isSecurePassword = function (password) {
    if (typeof password !== 'string') {
        core.setFailed('Error from passwordCheck.js - password is not type string!');
        return false;
    }

    if (password.length < 8) {
        // it is checked in regex anyway, but for a probably better error message it is prechecked :)
        core.setFailed('Error from passwordCheck.js - password is to short "password.length < 8"!')
        return false;
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!password.match(strongRegex)) {
        core.setFailed('Error from passwordCheck.js - password is not complex enough! (1 lowercase, 1 uppercase, 1 numeric, 1 special character [!@#$%^&*])')
        return false;
    }

    return true;
};

module.exports = isSecurePassword;

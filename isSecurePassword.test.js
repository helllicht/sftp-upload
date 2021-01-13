const isSecurePassword = require('./isSecurePassword');

const errMsg = 'Error from passwordCheck.js - password is not complex enough! (1 lowercase, 1 uppercase, 1 numeric, 1 special character [!@#$%^&*])';

test('isSecurePassword - wrong parameter type', async () => {
    try {
        isSecurePassword(1234);
    } catch (e) {
        await expect(e.message).toBe('Error from passwordCheck.js - password is not type string!')
    }
});

test('isSecurePassword - check password length', async () => {
    try {
        const tooShortPassword = '123abc';
        isSecurePassword(tooShortPassword)
    } catch (e) {
        await expect(e.message).toBe('Error from passwordCheck.js - password is to short "password.length < 8"!')
    }
});

test('isSecurePassword - check missing lowercase', async () => {
    try {
        const password = 'TESTSP3CIALCHAR$';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).toBe(errMsg)
    }
});

test('isSecurePassword - check missing uppercase', async () => {
    try {
        const password = 'testsp3cialchar$';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).toBe(errMsg)
    }
});

test('isSecurePassword - check missing special character', async () => {
    try {
        const password = 'TestSp3cialChar';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).toBe(errMsg)
    }
});

test('isSecurePassword - secure passwords 1', async () => {
    try {
        const password = 'TestSp3cialChar!';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 2', async () => {
    try {
        const password = 'TestSp3cialChar@';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 2', async () => {
    try {
        const password = 'TestSp3cialChar#';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 3', async () => {
    try {
        const password = 'TestSp3cialChar$';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 4', async () => {
    try {
        const password = 'TestSp3cialChar%';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 5', async () => {
    try {
        const password = 'TestSp3cialChar^';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 6', async () => {
    try {
        const password = 'TestSp3cialChar&';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 7', async () => {
    try {
        const password = 'TestSp3cialChar*';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 8', async () => {
    try {
        const password = 'TestSp3cialChar*';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 9', async () => {
    try {
        const password = 'TestSp3cialChar-';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

test('isSecurePassword - secure password example 10', async () => {
    try {
        const password = 'TestSp3cialChar_';
        isSecurePassword(password)
    } catch (e) {
        await expect(e.message).not.toBe(errMsg);
    }
});

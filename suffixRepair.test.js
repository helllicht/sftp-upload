const suffixRepair = require('./suffixRepair');

test('suffixRepair - wrong parameter type', async () => {
    try {
        suffixRepair(1234);
    } catch (e) {
        await expect(e.message).toBe('Error from suffixRepair.js - path is not type string - given: ')
    }
});

test('suffixRepair - empty string', async () => {
    try {
        suffixRepair('');
    } catch (e) {
        await expect(e.message).toBe('Error from suffixRepair.js - path.length is zero!')
    }
});

test('suffixRepair - invalid path', async () => {
    try {
        suffixRepair('dist/../');
    } catch (e) {
        await expect(e.message).toBe('Error from suffixRepair.js - path should not contain ".."!')
    }
});

test('suffixRepair - correct path 1', async () => {
    try {
        const path = suffixRepair('dist');
        await expect(path).toBe('dist/');
    } catch (e) {
        await expect(e.message).toBeNull();
    }
});

test('suffixRepair - correct path 2', async () => {
    try {
        const path = suffixRepair('dist/');
        await expect(path).toBe('dist/');
    } catch (e) {
        await expect(e.message).toBeNull();
    }
});


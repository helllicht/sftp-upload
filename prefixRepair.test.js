const prefixRepair = require('./prefixRepair');

test('prefixRepair - wrong parameter type', async () => {
    try {
        prefixRepair(1234);
    } catch (e) {
        await expect(e.message).toBe('Error from prefixRepair.js - path is not type string!')
    }
});

test('prefixRepair - empty string', async () => {
    try {
        prefixRepair('');
    } catch (e) {
        await expect(e.message).toBe('Error from prefixRepair.js - path.length is zero!')
    }
});

test('prefixRepair - invalid path', async () => {
    try {
        prefixRepair('./../dist');
    } catch (e) {
        await expect(e.message).toBe('Error from prefixRepair.js - path should not contain ".."!')
    }
});

test('prefixRepair - correct path 1', async () => {
    try {
        const path = prefixRepair('dist');
        await expect(path).toBe('./dist');
    } catch (e) {
        await expect(e.message).toBeNull();
    }
});

test('prefixRepair - correct path 2', async () => {
    try {
        const path = prefixRepair('.dist');
        await expect(path).toBe('./dist');
    } catch (e) {
        await expect(e.message).toBeNull();
    }
});

test('prefixRepair - correct path 3', async () => {
    try {
        const path = prefixRepair('/dist');
        await expect(path).toBe('./dist');
    } catch (e) {
        await expect(e.message).toBeNull();
    }
});
test('prefixRepair - correct path 4', async () => {
    try {
        const path = prefixRepair('./dist');
        await expect(path).toBe('./dist');
    } catch (e) {
        await expect(e.message).toBeNull();
    }
});

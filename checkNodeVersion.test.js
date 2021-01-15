const checkNodeVersion = require('./checkNodeVersion');

test('checkNodeVersion - check', async () => {
    try {
        checkNodeVersion();
    } catch (e) {
        await expect(e.message).not.toContain('Error');
    }
});

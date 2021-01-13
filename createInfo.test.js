const createInfo = require('./createInfo');
const fs = require('fs');

test('createInfo - wrong parameter type', async () => {
    try {
        await createInfo(1234);
    } catch (e) {
        await expect(e.message).toBe('Error from createInfo.js - localDir is not type string!')
    }
});

test('createInfo - create the file and check content', async () => {
    await createInfo('');
    await expect(fs.existsSync('./info.json')).toBeTruthy();

    fs.readFile('./info.json', 'utf8' , async (err, data) => {
        await expect(err).toBeFalsy();
        await expect(data).toContain('{"deployedAt":');
        fs.unlinkSync('./info.json');
    })
});

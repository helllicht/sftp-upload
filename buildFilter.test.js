const buildFilter = require('./buildFilter');

test('buildFilter - check', async () => {
    const input = JSON.parse('["test", ".git"]')
    try {
        buildFilter(input);
    } catch (e) {
        await expect(e.message).not.toContain('Error from buildFilter.js - Wrong exclude format!');
    }
});

test('buildFilter - fail (numbers)', async () => {
    const input = JSON.parse('[1, 2]')
    try {
        buildFilter(input);
    } catch (e) {
        await expect(e.message).toContain('Error from buildFilter.js - Wrong exclude format!');
    }
});

test('buildFilter - fail (object)', async () => {
    const input = JSON.parse('["test", { "test": "wow" }]')
    try {
        buildFilter(input);
    } catch (e) {
        await expect(e.message).toBe('Error from buildFilter.js - Wrong exclude format!');
    }
});

const core = require('@actions/core');

/**
 * @param {string} path
 * @return {string|null}
 */
let suffixRepair = function (path) {
    if (typeof path !== 'string') {
        core.setFailed('path is not type string!');
        throw new Error('Error from suffixRepair.js - path is not type string - given: ');
    }

    if (path.length === 0) {
        core.setFailed('path.length is zero!');
        throw new Error('Error from suffixRepair.js - path.length is zero!');
    }

    if (path.includes('..')) {
        core.setFailed('path should not contain ".."!');
        throw new Error('Error from suffixRepair.js - path should not contain ".."!');
    }

    if (path.endsWith('/')) {
        // 'example/'
        return path;
    }

    return (path + '/');
};

module.exports = suffixRepair;

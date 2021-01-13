const core = require('@actions/core');

/**
 * @param {string} path
 * @return {string|null}
 */
let suffixRepair = function (path) {
    if (typeof path !== 'string') {
        core.setFailed('Error from suffixRepair.js - path is not type string - given: ' + path + ' ,typeof: ' + typeof path);
        return null;
    }

    if (path.length === 0) {
        core.setFailed('Error from suffixRepair.js - path.length is zero!');
        return null;
    }

    if (path.includes('..')) {
        core.setFailed('Error from suffixRepair.js - path should not contain ".."!');
        return null;
    }

    if (path.endsWith('/')) {
        // 'example/'
        return path;
    }

    return (path + '/');
};

module.exports = suffixRepair;

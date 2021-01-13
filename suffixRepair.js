const core = require('@actions/core');

/**
 * @param {String} path
 * @return {Promise<string>}
 */
let suffixRepair = function (path) {
    return new Promise((resolve, reject) => {
        if (typeof path !== 'string') {
            core.setFailed('Error from suffixRepair.js - path is not type string - given: ' + path + ' ,typeof: ' + typeof path)
            return reject();
        }

        if (path.length === 0) {
            core.setFailed('Error from suffixRepair.js - path.length is zero!')
            return reject();
        }

        if (path.includes('..')) {
            core.setFailed('Error from suffixRepair.js - path should not contain ".."!')
            return reject();
        }

        if (path.endsWith('/')) {
            // 'example/'
            return resolve(path);
        }

        return resolve(path + '/');
    });
};

module.exports = suffixRepair;

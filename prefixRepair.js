const core = require('@actions/core');

/**
 * @param {String} path
 * @return {Promise<string>}
 */
let prefixRepair = function (path) {
    return new Promise((resolve, reject) => {
        if (typeof path !== 'string') {
            core.setFailed('Error from prefixRepair.js - path is not type string - given: ' + path + ' ,typeof: ' + typeof path)
            return reject();
        }

        if (path.length === 0) {
            core.setFailed('Error from prefixRepair.js - path.length is zero!')
            return reject();
        }

        if (path.includes('..')) {
            core.setFailed('Error from prefixRepair.js - path should not contain ".."!')
            return reject();
        }

        if (path.startsWith('./')) {
            // './example'
            return resolve(path);
        }

        const regexOnlyLetter = /^[A-Za-z]+$/;
        if (path.charAt(0).value.match(regexOnlyLetter)) {
            // 'example'
            return resolve('./' + path);
        }

        if (path.startsWith('/')) {
            // '/example'
            core.warning('prefixRepair.js - it is not allowed to start path with "/" - script prefixed it with "."')
            return resolve('.' + path);
        }

        if (path.startsWith('.')) {
            // '.example'
            core.warning('prefixRepair.js - it is not allowed to start path with "." - script prefixed path with "./"')

            return resolve('./' + path.slice(1, 99));
        }

        core.setFailed('Error from prefixRepair.js - no exit condition found!');
        return reject();
    });
};

module.exports = prefixRepair;

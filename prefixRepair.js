const core = require('@actions/core');

/**
 * @param {string} path
 * @return {string|null}
 */
let prefixRepair = function (path) {
    if (typeof path !== 'string') {
        core.setFailed('path is not type string!');
        throw new Error('Error from prefixRepair.js - path is not type string - given: ');
    }

    if (path.length === 0) {
        core.setFailed('path.length is zero!');
        throw new Error('Error from prefixRepair.js - path.length is zero!');
    }

    if (path.includes('..')) {
        core.setFailed(' path should not contain ".."!');
        throw new Error('Error from prefixRepair.js - path should not contain ".."!');
    }

    if (path.startsWith('./')) {
        // './example'
        return path;
    }

    if (path.startsWith('/')) {
        // '/example'
        core.info('prefixRepair.js - it is not allowed to start path with "/" - script prefixed it with "."');

        return ('.' + path);
    }

    if (path.startsWith('.')) {
        // '.example'
        core.info('prefixRepair.js - it is not allowed to start path with "." - script prefixed path with "./"');

        return ('./' + path.slice(1, 99));
    }

    return ('./' + path);
};

module.exports = prefixRepair;

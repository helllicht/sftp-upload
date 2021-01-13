const core = require('@actions/core');

/**
 * @param {String} path
 * @return {string|null}
 */
let prefixRepair = function (path) {
    if (typeof path !== 'string') {
        core.setFailed('Error from prefixRepair.js - path is not type string - given: ' + path + ' ,typeof: ' + typeof path);
        return null;
    }

    if (path.length === 0) {
        core.setFailed('Error from prefixRepair.js - path.length is zero!');
        return null;
    }

    if (path.includes('..')) {
        core.setFailed('Error from prefixRepair.js - path should not contain ".."!');
        return null;
    }

    if (path.startsWith('./')) {
        // './example'
        return path;
    }

    if (path.startsWith('/')) {
        // '/example'
        core.warning('prefixRepair.js - it is not allowed to start path with "/" - script prefixed it with "."');
        return ('.' + path);
    }

    if (path.startsWith('.')) {
        // '.example'
        core.warning('prefixRepair.js - it is not allowed to start path with "." - script prefixed path with "./"');

        return ('./' + path.slice(1, 99));
    }

    return ('./' + path);
};

module.exports = prefixRepair;

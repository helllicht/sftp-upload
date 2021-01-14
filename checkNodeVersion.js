const core = require('@actions/core');

let checkNodeVersion = function () {
    const NODE_MAJOR_VERSION = process.versions.node.split('.')[0];

    // WARNING (see here https://www.npmjs.com/package/ssh2-sftp-client#sec-1 )
    // There is currently a regression error with versions of node later than version 14.0.
    // Apparently the change in core node which cause the issue with ssh2 has been rolled back in node version 15.3.0.
    const SUPPORTED = ['12', '15']

    if (SUPPORTED.includes(NODE_MAJOR_VERSION)) {
        return;
    }

    core.setFailed('Not supported node.js version!');
    const supported_format = SUPPORTED.toString().replaceAll(',', ', ');
    throw new Error('Error from checkNodeVersion.js - Not supported node.js version! Supported versions: ' + supported_format);
};

module.exports = checkNodeVersion;

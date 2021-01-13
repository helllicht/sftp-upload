const fs = require('fs');

/**
 * @param {String} localDir
 * @return {Promise<void>}
 */
let createInfo = function (localDir) {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const jsonBody = {
            deployedAt: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
        };
        fs.writeFile (localDir + 'info.json', JSON.stringify(jsonBody), function(err) {
                if (err) {
                    console.error('Could not create info.json in ' + localDir);
                    return reject();
                }
                return resolve();
            }
        );
    });
};

module.exports = createInfo;

const fs = require('fs');

/**
 * @param {String} localDir
 * @return {Promise<void>}
 */
let createInfo = function (localDir) {
    return new Promise((resolve, reject) => {

        const now = new Date();
        const date = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full', timeStyle: 'long' }).format(now);

        const jsonBody = {
            deployedAt: date,
        };

        fs.writeFile(localDir + 'info.json', JSON.stringify(jsonBody), function (err) {
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

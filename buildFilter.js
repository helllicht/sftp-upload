const core = require('@actions/core');

/**
 * @param {string[]} exclude
 * @return {RegExp}
 */
let buildFilter = function (exclude) {
    if (exclude.length === 0) {
        return new RegExp('.*');
    }

    let regex = '';
    exclude.forEach((item) => {
        if (typeof item !== 'string') {
            core.setFailed('Wrong exclude format!');
            throw new Error('Error from buildFilter.js - Wrong exclude format!');
        }

        regex = regex + '^(?!' + item + ')'
    })
    core.info('RegExp used for upload filter: ' + regex.toString());

    return new RegExp(regex);
};

module.exports = buildFilter;

const core = require('@actions/core');
const client = require('ssh2-sftp-client');
const checkNodeVersion = require('./checkNodeVersion');
const createInfo = require('./createInfo');
const prefixRepair = require('./prefixRepair');
const suffixRepair = require('./suffixRepair');
const isSecurePassword = require('./isSecurePassword');

/**
 * @param input
 */
function debugHelper(input) {
    if (!input.toString().startsWith('DEBUG')) {
        core.info(input.toString());
    }
}

/**
 * The main function of the github action!
 * @return {Promise<void>}
 */
async function run() {
    try {
        // node 14 is not supported due to a bug!
        checkNodeVersion();

        const isRequired = { required: true };

        const host = core.getInput('host', isRequired);
        const port = core.getInput('port', isRequired);
        const username = core.getInput('username', isRequired);
        const password = core.getInput('password', isRequired);

        // check that password is secure (or throw error!)
        isSecurePassword(password);

        let localDirRaw = core.getInput('localDir', isRequired);
        let uploadPathRaw = core.getInput('uploadPath', isRequired);

        const localDir = prefixRepair(suffixRepair(localDirRaw));
        const uploadPath = prefixRepair(suffixRepair(uploadPathRaw));

        const config = {
            host: host,
            port: port,
            username: username,
            password: password,
            // - - -
            retries: 3,
            retry_factor: 2,
            retry_minTimeout: 2000,
        };

        if (core.getInput('debugMode') === 'on') {
            config['debug'] = debugHelper;
        }

        let sftp = new client('upload-client');

        sftp.connect(config)
            .then(() => {
                return sftp.cwd();
            })
            .then(base => {
                core.info(`Remote base directory is ${base}`);
            })
            .then(async () => {
                await createInfo(localDir);

                if (await sftp.exists(uploadPath + 'upload')) {
                    core.info('An old "upload" folder was found! The script tries to remove it!');
                    await sftp.rmdir(uploadPath + 'upload', true);
                }

                core.info('Start upload.');
                await sftp.uploadDir(localDir, uploadPath + 'upload');

                // if NOT exist create folder
                if (!await sftp.exists(uploadPath + 'active')) {
                    core.info('No "active" folder found (first time running this script?). The script tries to create it!');
                    await sftp.mkdir(uploadPath + 'active', true);
                }

                // if exist remove old backup
                if (await sftp.exists(uploadPath + 'backup')) {
                    core.info('Remove old backup, to save current "active" as "backup" afterwards.');
                    await sftp.rmdir(uploadPath + 'backup', true);
                }

                const start = Math.floor(new Date().getTime() / 1000);
                core.info('Rename directory "active" => "backup"');
                await sftp.rename('active', 'backup');

                core.info('Rename directory "upload" => "active"');
                await sftp.rename('upload', 'active');
                const done = Math.floor(new Date().getTime() / 1000);

                core.info('DONE - Folder swap took ' + (done - start) + ' seconds!');
            })
            .catch(err => {
                core.setFailed(err.message);
            })
            .finally(() => {
                sftp.end();
            });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

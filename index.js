const core = require('@actions/core');
const client = require('ssh2-sftp-client');
const checkNodeVersion = require('./checkNodeVersion');
const createInfo = require('./createInfo');
const prefixRepair = require('./prefixRepair');
const suffixRepair = require('./suffixRepair');
const isSecurePassword = require('./isSecurePassword');
const buildFilter = require('./buildFilter');

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
        const rawLocalDir = core.getInput('localDir', isRequired);
        const rawUploadPath = core.getInput('uploadPath', isRequired);
        const exclude = JSON.parse(core.getInput('exclude', isRequired));

        // check that password is secure (or throw error!)
        isSecurePassword(password);

        const localDir = prefixRepair(suffixRepair(rawLocalDir));
        const uploadPath = prefixRepair(suffixRepair(rawUploadPath));

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
                // create an info.json file
                await createInfo(localDir);

                // pre-check if an old upload folder exists
                if (await sftp.exists(uploadPath + 'upload')) {
                    core.info('An old "upload" folder was found! The script tries to remove it!');
                    await sftp.rmdir(uploadPath + 'upload', true);
                }

                // build filter
                const filter = buildFilter(exclude);

                // upload the directory
                core.info('UPLOAD - START');
                const startUpload = Math.floor(new Date().getTime() / 1000);
                await sftp.uploadDir(localDir, uploadPath + 'upload', filter);
                const doneUpload = Math.floor(new Date().getTime() / 1000);
                core.info('UPLOAD - DONE -> took ' + (doneUpload - startUpload) + ' seconds!');

                // if NOT exist create folder
                if (!await sftp.exists(uploadPath + 'active')) {
                    core.info('No "active" folder found (first time running this script?). The script tries to create it!');
                    await sftp.mkdir(uploadPath + 'active', true);
                }

                // rename (old) backup dir
                if (await sftp.exists(uploadPath + 'backup')) {
                    core.info('Rename directory "backup" => "backup-remove"');
                    await sftp.rename(uploadPath + 'backup', uploadPath + 'backup-remove');
                }

                // rename active dir
                const start = Math.floor(new Date().getTime() / 1000);
                core.info('Rename directory "active" => "backup"');
                await sftp.rename(uploadPath + 'active', uploadPath + 'backup');

                // rename upload dir
                core.info('Rename directory "upload" => "active"');
                await sftp.rename(uploadPath + 'upload', uploadPath + 'active');
                const done = Math.floor(new Date().getTime() / 1000);

                core.info('### Deployment is done - Folder swap took ' + (done - start) + ' seconds! ###');

                // remove backup-remove
                core.info('Auto-cleanup - backup-remove is now gonna be removed from server.')
                await sftp.rmdir(uploadPath + 'backup-remove', true);

                core.info('### DONE ###')
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

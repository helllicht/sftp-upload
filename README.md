# helllicht/sftp-upload

> https://github.com/actions/javascript-action

## Active versions
+ master
+ v0.1

## How to use this action
If not already done, add following folder structure to the project (name of the yml-file is up to you).
```
.
└── .github/
    └── workflows/
        └── deployment.yml
```
Example with a vue.js app:
> In this example just the 'staging'-Branch is deployed!
> read more about 'on:'
> here: https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on
```
name: Deployment (Staging)

on:
    push:
        branches:
            - staging

jobs:
    build:
        name: Deployment
        runs-on: ubuntu-18.04
        steps:
            - name: Checkout Repository
              uses: actions/checkout@v2
            - name: Install Node
              uses: actions/setup-node@v1
              with:
                  node-version: '12.x'
            - name: Build
              run: |
                  npm ci
                  npm run build
            - name: Upload
              uses: helllicht/sftp-upload@v1
              with:
                  host: 'the-real-ftp-url.com'
                  username: 'ftp-username'
                  password: ${{ secrets.SFTP_PASS }}
                  localDir: 'dist'
```
Add the variable SFTP_PASS to the repository in github.
-> https://github.com/your_name/the_repository/settings/secrets/actions
Do not ever commit the password to the repository! It will be visible in the action logs!

## Update an active version 
Breaking changes are not allowed when updating an active version!
1) checkout the branch (e.g. v1)
2) ...change code
3) `npm run test` (fix or write tests)
4) `npm run prepare`
5) commit & push (with dist folder!)

## Release new version
Make release note with a short overview.
1) create a new branch (e.g. v3)
2) ...change code
3) `npm run test` (fix or write tests)
4) `npm run prepare`
5) commit & push (with dist folder!)

## Workflow
#### Folders at start and after finish:

```
.
├── active <-- here the {localDir} will be deployed into
└── backup <-- the previous build (for rollback capabilities!)
```

#### Folders while deployment:

```
.
├── active
├── backup
├── backup-remove
└── upload
```

1. upload '{localDir}' to '{uploadPath}/upload'
2. rename '{uploadPath}/backup' to '{uploadPath}/backup-remove'
3. rename '{uploadPath}/active' to '{uploadPath}/backup'
4. rename '{uploadPath}/upload' to '{uploadPath}/active'
5. remove '{uploadPath}/backup-remove'

In the short time between step 3 and 4, the content is briefly inaccessible. Unfortunately, this is due to the fact that
SFTP and FTPS cannot create symlinks!
The reason why rename strategy is used, because it is much faster to rename a folder, than to delete it.
So first upload and rename the folders, then remove them to deploy as fast as possible.

The action will create a file '{localDir}/info.json' with the timestamp of the deployment!

[https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on]: https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on

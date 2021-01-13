# helllicht/sftp-upload

> https://github.com/actions/javascript-action

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


## Update an active version
1) checkout the branch (e.g. v1)
2) ...change code
3) `npm run prepare`
4) commit & push (with dist folder!)

## Release new version
1) create a new branch (e.g. v3)
2) ...change code
3) `npm run prepare`
4) commit & push (with dist folder!)

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
└── upload <- just exists while uploading
```

1. upload '{localDir}' to '{uploadPath}/upload'
2. remove '{uploadPath}/backup'
3. rename '{uploadPath}/active' to '{uploadPath}/backup'
4. rename '{uploadPath}/upload' to '{uploadPath}/active'

In the short time between step 3 and 4, the content is briefly inaccessible. Unfortunately, this is due to the fact that
SFTP and FTPS cannot create symlinks!

The action will create a file '{localDir}/info.json' with the timestamp of the deployment!

[https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on]: https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on

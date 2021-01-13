# Test action

Folders at start and after finish:
```
./active <-- here the {localDir} will be deployed into
./backup <-- the previous build (for rollback capabilities!)
```

Folders while deployment:
```
./active
./backup
./upload <- just exists while uploading
```

1. upload '{localDir}' to '{uploadPath}/upload'
2. remove '{uploadPath}/backup'
3. rename '{uploadPath}/active' to '{uploadPath}/backup'
4. rename '{uploadPath}/upload' to '{uploadPath}/active'

In the short time between step 3 and 4, the content is briefly inaccessible.
Unfortunately, this is due to the fact that SFTP and FTPS cannot create symlinks!

The action will create a file '{localDir}/info.json' with the timestamp of the deployment!

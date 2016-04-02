# Introduction

Your microflows, sometimes, look quite messy. This module is to help you to rearrange components in your microflow automatically, based on Dagre library.

# How to use

1. Install mfautolayout-cli

```
npm intall mfautolayout-cli -g
```

2. Install mfautolayout

```
npm install mfautolayout
```

3. Create config.js file in your current folder with content

```
var project = {
    username: 'xxx',
    apikey: 'YOUR API KEY',
    projectId: 'YOUR PROJECT ID',
    projectName: 'YOUR PROJECT NAME',
    revNo: -1,
    branchName: null // for mainline    
};
module.exports = project;
```

4. Enter the command

```
autolayout module1 module2
```
in which, module1 module2 are names of modules you want to arrange their microflows.
Without parameter, it will rearrrange all microflows in project except some special modules like System, Administration...
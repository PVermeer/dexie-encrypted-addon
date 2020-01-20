// @ts-check
const path = require('path');
const gitBranch = require('git-branch').sync(path.resolve(__dirname, 'PVermeer/dexie-encrypted-addon'));

console.log('Git branch: ' + gitBranch);

module.exports = {};

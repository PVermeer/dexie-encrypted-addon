const gitBranch = require('git-branch').sync();

console.log('AAAAAAAAAAAAAAAAAA ' + gitBranch);

module.exports = {
  extends: '@jedmao/semantic-release-npm-github-config',
  branch: 'next'
};

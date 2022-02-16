var fs = require('fs');
var path = require('path');
var cmd = require('../../lib/util/cmd');
var fetchBranch = require('../util/fetchBranch');

var githubTestPackage = path.join(__dirname, 'github-test-package');

function updateBranches() {
console.log('Updating "test-package" branches..');

return fetchBranch('master', githubTestPackage)
.then(function () {
return fetchBranch('some-branch', githubTestPackage);

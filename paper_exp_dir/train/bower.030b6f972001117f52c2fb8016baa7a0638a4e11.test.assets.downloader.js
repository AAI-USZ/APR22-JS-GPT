var fs = require('fs');
var path = require('path');
var cmd = require('../../lib/util/cmd');
var fetchBranch = require('../util/fetchBranch');

var githubTestPackage = path.join(__dirname, 'github-test-package');

function fetchBranch(branch, dir) {
return cmd('git', ['checkout', '-b', branch, 'origin/' + branch], { cwd: dir })
.then(null, function (err) {
if (/already exists/i.test(err.details)) {
return cmd('git', ['checkout', branch], { cwd: dir })
.then(function () {
return cmd('git', ['pull', 'origin', branch], { cwd: dir });
});
}
});
}

function updateBranches() {

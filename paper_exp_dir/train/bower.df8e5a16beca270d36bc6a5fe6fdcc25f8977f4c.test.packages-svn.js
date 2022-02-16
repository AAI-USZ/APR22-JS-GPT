var fs = require('../lib/util/fs');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('../lib/util/rimraf');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var cmd = require('../lib/util/cmd');
var packages = require('./packages-svn.json');
var nopt = require('nopt');

var isWin = function() {
return process.platform === 'win32';
};

var pathToUrl = function (localPath) {
localPath = path.normalize(localPath);

if (!isWin()) {
localPath = 'file://' + localPath;
} else {
localPath = 'file:///' + localPath;
}

return localPath;
};


var options = nopt({
'force': Boolean
}, {
'f': '--force'
});

var env = {};


mout.object.mixIn(env, process.env);

function ensurePackage(admin, dir) {
var promise = new Q();


if (options.force) {
promise = promise.then(function () {
return Q.nfcall(rimraf, admin);
});

promise = promise.then(function () {
return Q.nfcall(rimraf, dir);
});

promise = promise.then(function () {
throw new Error();
});

} else {
promise = Q.nfcall(fs.stat, path.join(dir, '.svn'));
}


return promise.fail(function () {

return Q.nfcall(mkdirp, dir)

.then(cmd.bind(null, 'svnadmin', ['create', admin], {}))

.then(cmd.bind(null, 'svn', ['checkout', pathToUrl(admin), dir], {}))

.then(cmd.bind(null, 'svn', ['mkdir', 'trunk'], { cwd: dir }))
.then(cmd.bind(null, 'svn', ['mkdir', 'tags'], { cwd: dir }))
.then(cmd.bind(null, 'svn', ['mkdir', 'branches'], { cwd: dir }))

.then(function () {
return cmd('svn', ['commit', '-m"Initial commit."'], {
cwd: dir,
env: env
});
})
.then(function () {
return dir;
});
});
}

function checkRelease(dir, release) {
if (semver.valid(release)) {
return cmd('svn', ['list', 'tags'], { cwd: dir })
.spread(function (stdout) {
return stdout.split(/\/\s*\r*\n\s*/).some(function (tag) {
return semver.clean(tag) === release;
});
});
}

return cmd('svn', ['list', 'branches'], { cwd: dir })
.spread(function (stdout) {
return stdout.split(/\/\s*\r*\n\s*/).some(function (branch) {
branch = branch.trim().replace(/^\*?\s*/, '');
return branch === release;
});
});
}

function createRelease(admin, dir, release, files) {

return cmd('svn', ['checkout', pathToUrl(admin), dir])

.then(function () {
return cmd('svn', ['delete', dir + '/branches/' + release], { cwd: dir })
.fail(function () {});
})

.then(function () {
cmd('svn', ['delete', dir + '/tags/' + release], { cwd: dir })
.fail(function (err) {});
})

.then(function () {
var promise;
var promises = [];

mout.object.forOwn(files, function (contents, name) {
name = path.join(dir + '/trunk', name);


if (typeof contents !== 'string') {
contents = JSON.stringify(contents, null, '  ');
}

promise = Q.nfcall(mkdirp, path.dirname(name))
.then(function () {
return Q.nfcall(fs.writeFile, name, contents);
});

promises.push(promise);
});

return Q.all(promises);
})

.then(cmd.bind(null, 'svn', ['add', '--force', '.'], { cwd: dir }))

.then(function () {
if (!semver.valid(release)) {
return;
}

return cmd('svn', ['copy', dir + '/trunk', dir + '/tags/' + release], { cwd: dir });
})

.then(function () {
if (!semver.valid(release)) {
return;
}

return cmd('svn', ['copy', dir + '/trunk', dir + '/branches/' + release], { cwd: dir });
})

.then(function () {
return cmd('svn', ['commit', '-m"SVN Setup'], {
cwd: dir,
env: env
});
});
}

var promises = [];


mout.object.forOwn(packages, function (pkg, name) {
var promise;
var admin = path.join(__dirname, 'assets', name, 'admin');
var dir = path.join(__dirname, 'assets', name, 'repo');


promise = ensurePackage(admin, dir);

promise = promise.fail(function (err) {
console.log('Failed to create ' + name);
console.log(err.message);
});

mout.object.forOwn(pkg, function (files, release) {

promise = promise.then(checkRelease.bind(null, dir, release))
.then(function (exists) {

if (exists) {
return console.log(chalk.cyan('> ') + 'Package ' + name + '#' + release + ' already created');
}


return createRelease(admin, dir, release, files)
.then(function () {
console.log(chalk.green('> ') + 'Package ' + name + '#' + release + ' successfully created');
});
})
.fail(function (err) {
console.log(chalk.red('> ') + 'Failed to create ' + name + '#' + release);
console.log(err.message.trim());
if (err.details) {
console.log(err.details.trim());
}
console.log(err.stack);
});
});

promises.push(promise);
});

Q.allSettled(promises, function (results) {
results.forEach(function (result) {
if (result.state !== 'fulfilled') {
process.exit(1);
}
});
});

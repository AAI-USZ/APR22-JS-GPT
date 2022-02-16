var fs = require('../lib/util/fs');
var path = require('path');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('../lib/util/rimraf');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var cmd = require('../lib/util/cmd');
var packages = require('./packages.json');
var nopt = require('nopt');

var options = nopt(
{
force: Boolean
},
{
f: '--force'
}
);

var env = {
GIT_AUTHOR_DATE: 'Sun Apr 7 22:13:13 2013 +0000',
GIT_AUTHOR_NAME: 'André Cruz',
GIT_AUTHOR_EMAIL: 'amdfcruz@gmail.com',
GIT_COMMITTER_DATE: 'Sun Apr 7 22:13:13 2013 +0000',
GIT_COMMITTER_NAME: 'André Cruz',
GIT_COMMITTER_EMAIL: 'amdfcruz@gmail.com'
};


mout.object.mixIn(env, process.env);

function ensurePackage(dir) {
var promise;


if (options.force) {
promise = Q.nfcall(rimraf, dir).then(function() {
throw new Error();
});

} else {
promise = Q.nfcall(fs.stat, path.join(dir, '.git'));
}


return promise.fail(function() {

return (
Q.nfcall(mkdirp, dir)

.then(cmd.bind(null, 'git', ['init'], { cwd: dir }))

.then(function() {
return Q.nfcall(
fs.writeFile,
path.join(dir, '.master'),
'based on master'
);
})

.then(cmd.bind(null, 'git', ['add', '-A'], { cwd: dir }))




.then(function() {
return cmd('git', ['commit', '-m"Initial commit."'], {
cwd: dir,
env: env
});
})
.then(function() {
return dir;
})
);
});
}

function checkRelease(dir, release) {
if (semver.valid(release)) {
return cmd('git', ['tag', '-l'], { cwd: dir }).spread(function(stdout) {
return stdout.split(/\s*\r*\n\s*/).some(function(tag) {
return semver.clean(tag) === release;
});
});
}

return cmd('git', ['branch', '--list'], { cwd: dir }).spread(function(
stdout
) {
return stdout.split(/\s*\r*\n\s*/).some(function(branch) {
branch = branch.trim().replace(/^\*?\s*/, '');
return branch === release;
});
});
}

function createRelease(dir, release, files) {
var branch = semver.valid(release) ? 'branch-' + release : release;


return (
cmd('git', ['checkout', 'master', '-f'], { cwd: dir })

.then(function() {
return cmd('git', ['branch', '-D', branch], {
cwd: dir
}).fail(function() {});
})

.then(
cmd.bind(null, 'git', ['checkout', '-b', branch, 'master'], {
cwd: dir
})
)

.then(function() {
var promise;
var promises = [];

mout.object.forOwn(files, function(contents, name) {
name = path.join(dir, name);


if (typeof contents !== 'string') {
contents = JSON.stringify(contents, null, '  ');
}

promise = Q.nfcall(mkdirp, path.dirname(name)).then(
function() {
return Q.nfcall(fs.writeFile, name, contents);
}
);

promises.push(promise);
});


promise = Q.nfcall(fs.unlink, path.join(dir, '.master'));
promises.push(promise);

return Q.all(promises);
})

.then(cmd.bind(null, 'git', ['add', '-A'], { cwd: dir }))




.then(function() {
return cmd(
'git',
['commit', '-m"Commit for ' + branch + '."'],
{
cwd: dir,
env: env
}
);
})

.then(function() {
if (!semver.valid(release)) {
return;
}

return (
cmd('git', ['tag', '-f', release], { cwd: dir })

.then(
cmd.bind(
null,
'git',
['checkout', 'master', '-f'],
{ cwd: dir }
)
)
.then(
cmd.bind(null, 'git', ['branch', '-D', branch], {
cwd: dir
})
)
);
})
);
}

var promises = [];


mout.object.forOwn(packages, function(pkg, name) {
var promise;
var dir = path.join(__dirname, 'assets', name);


promise = ensurePackage(dir);
promise = promise.fail(function(err) {
console.log('Failed to create ' + name);
console.log(err.message);
});

mout.object.forOwn(pkg, function(files, release) {

promise = promise
.then(checkRelease.bind(null, dir, release))
.then(function(exists) {

if (exists) {
return console.log(
chalk.cyan('> ') +
'Package ' +
name +
'#' +
release +
' already created'
);
}


return createRelease(dir, release, files).then(function() {
console.log(
chalk.green('> ') +
'Package ' +
name +
'#' +
release +
' successfully created'
);
});
})
.fail(function(err) {
console.log(
chalk.red('> ') + 'Failed to create ' + name + '#' + release
);
console.log(err.message.trim());
if (err.details) {
console.log(err.details.trim());
}
console.log(err.stack);
});
});

promises.push(promise);
});

Q.allSettled(promises, function(results) {
results.forEach(function(result) {
if (result.state !== 'fulfilled') {
process.exit(1);
}
});
});

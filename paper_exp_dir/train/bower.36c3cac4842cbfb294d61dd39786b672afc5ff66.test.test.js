var GitRemoteResolver = require('../lib/resolve/resolvers/GitRemoteResolver');
var GitFsResolver = require('../lib/resolve/resolvers/GitFsResolver');

function testGitRemoteResolver() {
var dejavuResolver = new GitRemoteResolver('git://github.com/IndigoUnited/dejavu.git', {
name: 'dejavu',


target: '~0.4.1'
});

return dejavuResolver.resolve()
.then(function () {
console.log('ok!');
}, function (err) {
console.log('failed to resolve', err);
});
}

function testGitLocalResolver() {
var bowerResolver = new GitFsResolver('.', {
name: 'bower',
target: 'rewrite'
});

return bowerResolver.resolve()
.then(function () {
console.log('ok!');
}, function (err) {
console.log('failed to resolve', err);
});
}

function testGitRemoteResolverNoTags() {
var spoonResolver = new GitRemoteResolver('git://github.com/IndigoUnited/spoon.js.git', {
name: 'spoonjs',


target: '*'

var GitRemoteResolver = require('../lib/resolve/resolvers/GitRemoteResolver');
var GitFsResolver = require('../lib/resolve/resolvers/GitFsResolver');

function testGitRemoteResolver() {
var dejavuResolver = new GitRemoteResolver('git://github.com/IndigoUnited/dejavu.git', {
name: 'dejavu',

target: 'master'

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

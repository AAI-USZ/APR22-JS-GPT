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

target: '0.8.4'
});

return bowerResolver.resolve()
.then(function () {
console.log('ok!');
}, function (err) {
console.log('failed to resolve', err);
});
}

if (process.argv[1] && !/mocha/.test(process.argv[1])) {
testGitRemoteResolver()
.then(testGitLocalResolver);


}

var GitResolver = require('../lib/resolve/resolvers/GitRemoteResolver');

function testGitResolver() {
var dejavuResolver = new GitResolver('git://github.com/IndigoUnited/dejavu.git', {
name: 'dejavu',


target: '~0.4.1'
});

return dejavuResolver.resolve()

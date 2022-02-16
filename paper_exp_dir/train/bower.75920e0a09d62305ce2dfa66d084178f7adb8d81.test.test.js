var path = require('path');
var GitRemoteResolver = require('../lib/resolve/resolvers/GitRemoteResolver');
var GitFsResolver = require('../lib/resolve/resolvers/GitFsResolver');
var fetchBranch = require('./util/fetchBranch');

function testGitRemoteResolver() {
var dejavuResolver = new GitRemoteResolver('git://github.com/IndigoUnited/dejavu.git', {
name: 'dejavu',



var Q = require('Q');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver = require('./resolvers/FsResolver');
var UrlResolver = require('./resolvers/UrlResolver');

function createResolver(endpoint, options) {
var split = endpoint.split('#'),
source,
target;


source = split[0];
target = split[1];


options = options || {};
options.target = options.target || target;


return Q.fcall(new GitRemoteResolver(source, options));

var Q = require('Q');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver = require('./resolvers/FsResolver');
var UrlResolver = require('./resolvers/UrlResolver');

function createResolver(endpoint, options) {
var split = endpoint.split('#'),
range;


endpoint = split[0];
range = split[1];


options = options || {};

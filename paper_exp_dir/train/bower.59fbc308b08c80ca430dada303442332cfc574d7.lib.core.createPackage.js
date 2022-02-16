var Q = require('Q');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var LocalResolver = require('./resolvers/LocalResolver');
var UrlResolver = require('./resolvers/UrlResolver');
var GitFsResolver = require('./resolvers/GitFsResolver');

function createResolver(endpoint, options) {
var split = endpoint.split('#'),
range;


endpoint = split[0];
range = split[1];

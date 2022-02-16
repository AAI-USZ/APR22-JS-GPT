var Q                 = require('q');
var fs                = require('fs');
var path              = require('path');
var request           = require('request');
var GitFsResolver     = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver        = require('./resolvers/FsResolver');
var UrlResolver       = require('./resolvers/UrlResolver');



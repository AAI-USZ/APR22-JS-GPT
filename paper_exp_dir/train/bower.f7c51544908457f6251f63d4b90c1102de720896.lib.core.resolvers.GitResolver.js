var util = require('util');
var path = require('path');
var Q = require('q');
var rimraf = require('../../util/rimraf');
var mkdirp = require('mkdirp');
var which = require('which');
var LRU = require('lru-cache');
var mout = require('mout');
var Resolver = require('./Resolver');
var semver = require('../../util/semver');
var createError = require('../../util/createError');

var hasGit;


try {
which.sync('git');
hasGit = true;
} catch (ex) {
hasGit = false;
}

function GitResolver(decEndpoint, config, logger) {



mkdirp.sync(config.storage.empty);
process.env.GIT_TEMPLATE_DIR = config.storage.empty;
if (!config.strictSsl) {
process.env.GIT_SSL_NO_VERIFY = 'true';
}
process.env.GIT_TERMINAL_PROMPT = config.interactive ? '1' : '0';

Resolver.call(this, decEndpoint, config, logger);

if (!hasGit) {
throw createError('git is not installed or not in the PATH', 'ENOGIT');
}
}

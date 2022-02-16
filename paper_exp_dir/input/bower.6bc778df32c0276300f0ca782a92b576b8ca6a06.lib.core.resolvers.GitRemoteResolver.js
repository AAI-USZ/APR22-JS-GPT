var util = require('util');
var url = require('url');
var Q = require('q');
var mout = require('mout');
var LRU = require('lru-cache');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

function GitRemoteResolver(decEndpoint, config, logger) {
GitResolver.call(this, decEndpoint, config, logger);

if (!mout.string.startsWith(this._source, 'file://')) {

this._source = this._source.replace(/\/+$/, '');
}


if (this._guessedName && mout.string.endsWith(this._name, '.git')) {
this._name = this._name.slice(0, -4);
}


if (!/:\/\
this._remote = url.parse('ssh://' + this._source);
} else {
this._remote = url.parse(this._source);
}

this._host = this._remote.host;


this._shallowClone = this._supportsShallowCloning;
}

util.inherits(GitRemoteResolver, GitResolver);
mout.object.mixIn(GitRemoteResolver, GitResolver);



var promise;
var timer;
var reporter;
var that = this;
var resolution = this._resolution;


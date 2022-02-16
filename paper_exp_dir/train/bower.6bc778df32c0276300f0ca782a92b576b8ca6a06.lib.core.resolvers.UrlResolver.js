var util = require('util');
var path = require('path');
var fs = require('../../util/fs');
var url = require('url');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var Resolver = require('./Resolver');
var download = require('../../util/download');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function UrlResolver(decEndpoint, config, logger) {
Resolver.call(this, decEndpoint, config, logger);


if (this._target !== '*') {
throw createError("URL sources can't resolve targets", 'ENORESTARGET');
}


if (this._guessedName) {

this._name = this._name.replace(/\?.*$/, '');

this._name = this._name.substr(
0,
this._name.length - path.extname(this._name).length
);
}

this._remote = url.parse(this._source);
}

util.inherits(UrlResolver, Resolver);
mout.object.mixIn(UrlResolver, Resolver);


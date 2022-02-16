var util = require('util');
var mout = require('mout');
var SvnResolver = require('./SvnResolver');
var cmd = require('../../util/cmd');

function SvnRemoteResolver(decEndpoint, config, logger) {
SvnResolver.call(this, decEndpoint, config, logger);

if (!mout.string.startsWith(this._source, 'http://')) {

this._source = this._source.replace('svn://', 'http://');

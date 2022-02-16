var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var cmd = require('../../util/cmd');

var GitRemoteResolver = function (source, options) {
if (!mout.string.startsWith(source, 'file://')) {

source = source.replace(/\/+$/, '');


if (!mout.string.endsWith(source, '.git')) {
source += '.git';
}
}

GitResolver.call(this, source, options);

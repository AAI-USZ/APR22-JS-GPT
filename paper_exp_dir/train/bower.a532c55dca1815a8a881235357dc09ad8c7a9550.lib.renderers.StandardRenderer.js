var chalk = require('chalk');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var Q = require('q');
var stringifyObject = require('stringify-object');
var os = require('os');
var semverUtils = require('semver-utils');
var pkg = require(path.join(__dirname, '../..', 'package.json'));
var template = require('../util/template');

function StandardRenderer(command, config) {
this._sizes = {
id: 13,
label: 20,
sumup: 5
};

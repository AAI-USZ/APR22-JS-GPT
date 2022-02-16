require('colors');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var stringifyObject = require('stringify-object');
var template = require('../util/template');
var pkg = require(path.join(__dirname, '../..', 'package.json'));
var os = require('os');

function StandardRenderer(command, config) {
this._sizes = {
id: 13,
label: 20,
sumup: 5
};
this._colors = {

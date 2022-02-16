var fs = require('graceful-fs');
var path = require('path');
var deepExtend = require('deep-extend');
var isAsset = require('./util/isAsset');
var isComponent = require('./util/isComponent');
var createError = require('./util/createError');

var possibleJsons = ['bower.json', 'component.json', '.bower.json'];

function read(file, options, callback) {
if (typeof options === 'function') {
callback = options;
options = {};

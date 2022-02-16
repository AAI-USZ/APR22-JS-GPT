require('colors');
var path = require('path');
var fs = require('graceful-fs');
var Handlebars = require('handlebars');
var mout = require('mout');
var helpers = require('../../templates/helpers');

var templatesDir = path.resolve(__dirname, '../../templates');
var cache = {};


mout.object.forOwn(helpers, function (register) {

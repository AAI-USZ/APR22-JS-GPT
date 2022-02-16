var format = require('util').format,
fs = require('fs'),
_ = require('underscore'),
lang = 'default',
compile;

var i18n = function(namespace){
var _store = {};

this.namespace = namespace;

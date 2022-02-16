var compile = require('./render').compile,
format = require('util').format,
fs = require('fs'),
_ = require('underscore');

var i18n = function(namespace){
this.namespace = namespace;
this.store = {};
};


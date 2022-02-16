

'use strict';



var debug = require('debug')('express:view');
var path = require('path');
var fs = require('fs');
var utils = require('./utils');



var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;



module.exports = View;



function View(name, options) {
var opts = options || {};

this.defaultEngine = opts.defaultEngine;
this.ext = extname(name);
this.name = name;
this.root = opts.root;

if (!this.ext && !this.defaultEngine) {
throw new Error('No default engine was specified and no extension was provided.');
}

var fileName = name;

if (!this.ext) {

this.ext = this.defaultEngine[0] !== '.'
? '.' + this.defaultEngine
: this.defaultEngine;

fileName += this.ext;
}

if (!opts.engines[this.ext]) {

var mod = this.ext.substr(1)
debug('require "%s"', mod)
opts.engines[this.ext] = require(mod).__express
}


this.engine = opts.engines[this.ext];


this.path = this.lookup(fileName);
}

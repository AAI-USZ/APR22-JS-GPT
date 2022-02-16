

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

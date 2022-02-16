

'use strict';



var debug = require('debug')('express:view');
var path = require('path');
var fs = require('fs');



var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;



module.exports = View;



function View(name, options) {

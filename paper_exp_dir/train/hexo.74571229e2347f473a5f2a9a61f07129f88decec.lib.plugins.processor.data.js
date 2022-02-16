'use strict';

var util = require('hexo-util');
var pathFn = require('path');
var Pattern = util.Pattern;

exports.process = function(file){
if (this.render.getOutput(file.path) !== 'json') return;

var Data = this.model('Data');

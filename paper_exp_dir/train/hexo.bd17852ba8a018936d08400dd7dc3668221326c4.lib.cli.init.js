var Hexo = require('../hexo');
var pathFn = require('path');
var fs = require('hexo-fs');

var cwd = process.cwd();
var lastCwd = cwd;

require('colors');


function findConfigFile(){


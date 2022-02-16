var Hexo = require('../hexo');
var pathFn = require('path');
var fs = require('hexo-fs');
var chalk = require('chalk');

var cwd = process.cwd();
var lastCwd = cwd;


function findConfigFile(){

return fs.exists(pathFn.join(cwd, '_config.yml')).then(function(exist){
if (exist) return;


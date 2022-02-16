var pathFn = require('path');
var fs = require('hexo-fs');
var tildify = require('tildify');
var Promise = require('bluebird');
var vm = require('vm');
var Module = require('module');
var chalk = require('chalk');

var pre = '(function(exports, require, module, __filename, __dirname, hexo){';
var post = '});';

module.exports = function(ctx){
if (!ctx.env.init || ctx.env.safe) return;

return Promise.all([
loadModules(ctx),

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
loadScripts(ctx)
]);
};

function runInContext(ctx, path){
return fs.readFile(path).then(function(script){

var module = new Module(path);
module.filename = path;
module.paths = Module._nodeModulePaths(path);

function require(path){
return module.require(path);
}

require.resolve = function(request){
return Module._resolveFilename(request, module);
};

require.main = process.mainModule;
require.extensions = Module._extensions;
require.cache = Module._cache;

var fn = vm.runInThisContext(pre + script + post, path);

return fn(module.exports, require, module, path, pathFn.dirname(path), ctx);
});
}

function loadModules(ctx){
var packagePath = pathFn.join(ctx.base_dir, 'package.json');
var pluginDir = ctx.plugin_dir;


return fs.exists(packagePath).then(function(exist){
if (!exist) return [];


return fs.readFile(packagePath).then(function(content){
var json = JSON.parse(content);

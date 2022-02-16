'use strict';

var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var chalk = require('chalk');

module.exports = function(ctx) {
if (!ctx.env.init || ctx.env.safe) return;

return Promise.all([
loadModules(ctx),
loadScripts(ctx)
]);
};

function loadModules(ctx) {
var packagePath = pathFn.join(ctx.base_dir, 'package.json');
var pluginDir = ctx.plugin_dir;


return fs.exists(packagePath).then(function(exist) {
if (!exist) return [];


return fs.readFile(packagePath).then(function(content) {
var json = JSON.parse(content);
var deps = json.dependencies || {};

return Object.keys(deps);
});
}).filter(function(name) {

if (name.substring(0, 5) !== 'hexo-') return false;


var path = pathFn.join(pluginDir, name);
return fs.exists(path);
}).map(function(name) {
var path = require.resolve(pathFn.join(pluginDir, name));


return ctx.loadPlugin(path).then(function() {
ctx.log.debug('Plugin loaded: %s', chalk.magenta(name));
}).catch(function(err) {
ctx.log.error({err: err}, 'Plugin load failed: %s', chalk.magenta(name));
});
});
}

function loadScripts(ctx) {
var baseDirLength = ctx.base_dir.length;

function displayPath(path) {

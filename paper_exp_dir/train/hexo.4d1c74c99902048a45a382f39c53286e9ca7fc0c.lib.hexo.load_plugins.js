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

function loadModuleList(ctx) {
if (ctx.config && Array.isArray(ctx.config.plugins)) {
return Promise.resolve(ctx.config.plugins).filter(function(item) {
return typeof item === 'string';
});
}

var packagePath = pathFn.join(ctx.base_dir, 'package.json');
var pluginDir = ctx.plugin_dir;


return fs.exists(packagePath).then(function(exist) {
if (!exist) return [];


return fs.readFile(packagePath).then(function(content) {
var json = JSON.parse(content);
var deps = Object.keys(json.dependencies || {});
var devDeps = Object.keys(json.devDependencies || {});

return deps.concat(devDeps);
});
}).filter(function(name) {

if (!/^hexo-|^@[^/]+\/hexo-/.test(name)) return false;


var path = pathFn.join(pluginDir, name);

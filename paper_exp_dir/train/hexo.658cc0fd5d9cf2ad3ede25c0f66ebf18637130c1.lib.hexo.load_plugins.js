'use strict';

var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var chalk = require('chalk');

module.exports = function(ctx) {
if (!ctx.env.init || ctx.env.safe) return;

return loadModules(ctx).then(function() {
return loadScripts(ctx);
});
};

function loadModuleList(ctx) {
if (ctx.config && Array.isArray(ctx.config.plugins)) {
return Promise.resolve(ctx.config.plugins).filter(function(item) {
return typeof item === 'string';
});

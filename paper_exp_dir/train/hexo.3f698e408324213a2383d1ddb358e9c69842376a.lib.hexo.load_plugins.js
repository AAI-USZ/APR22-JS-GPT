var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var chalk = require('chalk');

module.exports = function(ctx){
if (!ctx.env.init || ctx.env.safe) return;

return Promise.all([
loadModules(ctx),
loadScripts(ctx)
]);
};

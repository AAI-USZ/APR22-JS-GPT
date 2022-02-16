'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const chalk = require('chalk');

module.exports = ctx => {
if (!ctx.env.init || ctx.env.safe) return;

return loadModules(ctx).then(() => loadScripts(ctx));
};

function loadModuleList(ctx) {
if (ctx.config && Array.isArray(ctx.config.plugins)) {

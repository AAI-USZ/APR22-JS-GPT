'use strict';

const { join } = require('path');
const { exists, readFile, listDir } = require('hexo-fs');
const Promise = require('bluebird');
const { magenta } = require('chalk');

module.exports = ctx => {
if (!ctx.env.init || ctx.env.safe) return;

return loadModules(ctx).then(() => loadScripts(ctx));
};

function loadModuleList(ctx) {
let customThemeName;

if (ctx.config) {
const { theme, plugins } = ctx.config;

if (Array.isArray(plugins)) {
return Promise.resolve(plugins).filter(item => typeof item === 'string');
}

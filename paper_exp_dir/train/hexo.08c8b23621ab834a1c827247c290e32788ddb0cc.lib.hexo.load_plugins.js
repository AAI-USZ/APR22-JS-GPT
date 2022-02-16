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
const { theme } = ctx.config;

if (theme) {
customThemeName = String(theme);
}
}

const packagePath = join(ctx.base_dir, 'package.json');


return exists(packagePath).then(exist => {
if (!exist) return [];


return readFile(packagePath).then(content => {
const json = JSON.parse(content);
const deps = Object.keys(json.dependencies || {});
const devDeps = Object.keys(json.devDependencies || {});

return deps.concat(devDeps);
});
}).filter(name => {

if (name.endsWith(`hexo-theme-${customThemeName}`)) return false;


if (!/^hexo-|^@[^/]+\/hexo-/.test(name)) return false;


if (name.startsWith('@types/')) return false;


const path = ctx.resolvePlugin(name);
return exists(path);
});
}

function loadModules(ctx) {
return loadModuleList(ctx).map(name => {
const path = ctx.resolvePlugin(name);


return ctx.loadPlugin(path).then(() => {
ctx.log.debug('Plugin loaded: %s', magenta(name));
}).catch(err => {
ctx.log.error({err}, 'Plugin load failed: %s', magenta(name));
});
});
}

function loadScripts(ctx) {
const baseDirLength = ctx.base_dir.length;

function displayPath(path) {
return magenta(path.substring(baseDirLength));
}

return Promise.filter([
ctx.theme_script_dir,
ctx.script_dir
], scriptDir => {
return scriptDir ? exists(scriptDir) : false;
}).map(scriptDir => listDir(scriptDir).map(name => {
const path = join(scriptDir, name);

return ctx.loadPlugin(path).then(() => {
ctx.log.debug('Script loaded: %s', displayPath(path));
}).catch(err => {
ctx.log.error({err}, 'Script load failed: %s', displayPath(path));
});
}));
}

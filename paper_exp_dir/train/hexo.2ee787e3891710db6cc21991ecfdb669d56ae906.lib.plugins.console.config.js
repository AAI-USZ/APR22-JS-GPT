'use strict';

const yaml = require('js-yaml');
const fs = require('hexo-fs');
const pathFn = require('path');
const Promise = require('bluebird');

function configConsole(args) {
const key = args._[0];
let value = args._[1];
const self = this;

if (!key) {
console.log(this.config);
return Promise.resolve();
}

if (!value) {
value = getProperty(this.config, key);
if (value) console.log(value);
return Promise.resolve();
}

const configPath = this.config_path;
const extname = pathFn.extname(configPath);

return fs.exists(configPath).then(exist => {

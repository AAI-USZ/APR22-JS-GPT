'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');
const pathFn = require('path');
const chalk = require('chalk');

function assetGenerator(locals) {
const process = name => {
return Promise.filter(this.model(name).toArray(), asset => fs.exists(asset.source).then(exist => {
if (exist) return exist;
return asset.remove().thenReturn(exist);
})).map(asset => {
const source = asset.source;
let path = asset.path;
const data = {
modified: asset.modified
};

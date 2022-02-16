'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');
const { extname } = require('path');
const chalk = require('chalk');

const process = (name, ctx) => {
return Promise.filter(ctx.model(name).toArray(), asset => fs.exists(asset.source).tap(exist => {
if (!exist) return asset.remove();
})).map(asset => {
const { source } = asset;
let { path } = asset;
const data = {
modified: asset.modified
};


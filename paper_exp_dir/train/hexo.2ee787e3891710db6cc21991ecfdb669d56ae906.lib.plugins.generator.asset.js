'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');
const pathFn = require('path');
const chalk = require('chalk');

function assetGenerator(locals) {
const self = this;

function process(name) {
return Promise.filter(self.model(name).toArray(), asset => fs.exists(asset.source).then(exist => {
if (exist) return exist;
return asset.remove().thenReturn(exist);
})).map(asset => {
const source = asset.source;

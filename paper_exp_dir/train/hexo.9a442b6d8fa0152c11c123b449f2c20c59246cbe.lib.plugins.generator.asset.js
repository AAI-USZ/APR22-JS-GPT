'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');
const { extname } = require('path');
const chalk = require('chalk');

function assetGenerator(locals) {
const self = this;

function process(name) {
return Promise.filter(self.model(name).toArray(), asset => fs.exists(asset.source).tap(exist => {
if (!exist) return asset.remove();
})).map(asset => {
const { source } = asset;
let { path } = asset;
const data = {

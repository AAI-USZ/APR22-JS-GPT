'use strict';

const { Pattern } = require('hexo-util');
const { extname } = require('path');

module.exports = ctx => ({
pattern: new Pattern('_data/*path'),

process: function dataProcessor(file) {
const Data = ctx.model('Data');
const { path } = file.params;
const id = path.substring(0, path.length - extname(path).length);
const doc = Data.findById(id);

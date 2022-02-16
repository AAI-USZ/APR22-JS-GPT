'use strict';

const util = require('hexo-util');
const pathFn = require('path');
const Pattern = util.Pattern;

module.exports = ctx => ({
pattern: new Pattern('_data/*path'),

process: function dataProcessor(file) {
const Data = ctx.model('Data');
const path = file.params.path;
const extname = pathFn.extname(path);
const id = path.substring(0, path.length - extname.length);

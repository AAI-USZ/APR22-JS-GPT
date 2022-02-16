'use strict';

const util = require('hexo-util');
const { extname } = require('path');
const { Pattern } = util;

module.exports = ctx => ({
pattern: new Pattern('_data/*path'),

process: function dataProcessor(file) {
const Data = ctx.model('Data');
const { path } = file.params;
const id = path.substring(0, path.length - extname(path).length);
const doc = Data.findById(id);

if (file.type === 'skip' && doc) {
return;
}

if (file.type === 'delete') {
if (doc) {

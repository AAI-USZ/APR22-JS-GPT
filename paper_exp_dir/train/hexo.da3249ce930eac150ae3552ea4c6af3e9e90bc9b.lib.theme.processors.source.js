'use strict';

const Pattern = require('hexo-util').Pattern;
const common = require('../../plugins/processor/common');

exports.process = function(file) {
const Asset = this.model('Asset');
const id = file.source.substring(this.base_dir.length).replace(/\\/g, '/');
const path = file.params.path;
const doc = Asset.findById(id);

if (file.type === 'delete') {

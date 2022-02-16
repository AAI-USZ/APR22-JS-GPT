'use strict';

const Promise = require('bluebird');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const { join } = require('path');

describe('data', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = join(__dirname, 'data_test');
const hexo = new Hexo(baseDir);
const processor = require('../../../lib/plugins/processor/data')(hexo);
const process = Promise.method(processor.process).bind(hexo);
const { source } = hexo;
const { File } = source;
const Data = hexo.model('Data');

function newFile(options) {
const path = options.path;

options.params = {
path
};

options.path = '_data/' + path;
options.source = join(source.base, options.path);


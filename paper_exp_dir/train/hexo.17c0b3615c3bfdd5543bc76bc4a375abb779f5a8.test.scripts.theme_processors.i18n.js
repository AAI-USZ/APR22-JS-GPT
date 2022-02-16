'use strict';

const { join } = require('path');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');

describe('i18n', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), {silent: true});
const processor = require('../../../lib/theme/processors/i18n');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = join(hexo.base_dir, 'themes', 'test');

function newFile(options) {
const { path } = options;

options.params = { path };

options.path = 'languages/' + path;
options.source = join(themeDir, options.path);


'use strict';

const { join } = require('path');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');

describe('source', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'source_test'), {silent: true});
const processor = require('../../../lib/theme/processors/source');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = join(hexo.base_dir, 'themes', 'test');
const Asset = hexo.model('Asset');

function newFile(options) {
const { path } = options;

options.params = {path};
options.path = 'source/' + path;
options.source = join(themeDir, options.path);

return new hexo.theme.File(options);
}

before(async () => {
await Promise.all([
mkdirs(themeDir),
writeFile(hexo.config_path, 'theme: test')

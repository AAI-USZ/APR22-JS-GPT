'use strict';

const { join } = require('path');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');

describe('view', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'view_test'), {silent: true});
const processor = require('../../../lib/theme/processors/view');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = join(hexo.base_dir, 'themes', 'test');

hexo.env.init = true;

function newFile(options) {
const { path } = options;

options.params = {path};
options.path = 'layout/' + path;
options.source = join(themeDir, options.path);

return new hexo.theme.File(options);
}

before(async () => {
await Promise.all([
mkdirs(themeDir),
writeFile(hexo.config_path, 'theme: test')

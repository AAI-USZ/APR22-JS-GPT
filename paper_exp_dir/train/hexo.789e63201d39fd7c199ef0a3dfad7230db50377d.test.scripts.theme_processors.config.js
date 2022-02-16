'use strict';

const { spy } = require('sinon');
const { join } = require('path');
const { mkdirs, rmdir, unlink, writeFile} = require('hexo-fs');
const Promise = require('bluebird');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), {silent: true});
const processor = require('../../../lib/theme/processors/config');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = join(hexo.base_dir, 'themes', 'test');

function newFile(options) {
options.source = join(themeDir, options.path);
return new hexo.theme.File(options);
}

before(async () => {
await Promise.all([
mkdirs(themeDir),
writeFile(hexo.config_path, 'theme: test')

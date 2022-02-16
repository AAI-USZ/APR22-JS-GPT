'use strict';

const { dirname, join } = require('path');
const { mkdirs, rmdir, stat, unlink, writeFile } = require('hexo-fs');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('asset', () => {
const Hexo = require('../../../lib/hexo');
const defaults = require('../../../lib/hexo/default_config');
const baseDir = join(__dirname, 'asset_test');
const hexo = new Hexo(baseDir);
const asset = require('../../../lib/plugins/processor/asset')(hexo);
const process = asset.process.bind(hexo);
const { pattern } = asset;

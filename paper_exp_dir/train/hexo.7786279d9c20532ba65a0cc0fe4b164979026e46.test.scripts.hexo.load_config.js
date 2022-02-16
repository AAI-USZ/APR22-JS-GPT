'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');

describe('Load config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
const loadConfig = require('../../../lib/hexo/load_config');
const defaultConfig = require('../../../lib/hexo/default_config');

hexo.env.init = true;

before(() => fs.mkdirs(hexo.base_dir).then(() => hexo.init()));

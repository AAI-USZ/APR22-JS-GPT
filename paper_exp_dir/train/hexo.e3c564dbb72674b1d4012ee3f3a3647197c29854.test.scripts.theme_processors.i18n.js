'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('i18n', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
const processor = require('../../../lib/theme/processors/i18n');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

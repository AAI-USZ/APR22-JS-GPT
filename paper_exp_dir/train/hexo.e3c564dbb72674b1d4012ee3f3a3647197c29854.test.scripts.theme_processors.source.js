'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('source', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'source_test'), {silent: true});
const processor = require('../../../lib/theme/processors/source');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

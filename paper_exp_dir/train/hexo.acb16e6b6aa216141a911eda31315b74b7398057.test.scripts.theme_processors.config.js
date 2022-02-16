const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
const processor = require('../../../lib/theme/processors/config');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

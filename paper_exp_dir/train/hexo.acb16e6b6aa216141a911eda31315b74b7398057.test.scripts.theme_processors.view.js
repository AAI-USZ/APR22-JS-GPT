const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('view', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'view_test'), {silent: true});
const processor = require('../../../lib/theme/processors/view');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

hexo.env.init = true;

function newFile(options) {
const path = options.path;

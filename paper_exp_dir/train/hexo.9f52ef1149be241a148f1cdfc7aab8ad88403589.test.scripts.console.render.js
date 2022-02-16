'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const Promise = require('bluebird');

describe('render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'render_test'), {silent: true});
const render = require('../../../lib/plugins/console/render').bind(hexo);

before(() => fs.mkdirs(hexo.base_dir).then(() => hexo.init()));

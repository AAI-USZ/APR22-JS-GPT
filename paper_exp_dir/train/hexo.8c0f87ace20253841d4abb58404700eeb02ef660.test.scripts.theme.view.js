'use strict';

const { join } = require('path');
const { mkdirs, rmdir, writeFile } = require('hexo-fs');
const moment = require('moment');
const { spy } = require('sinon');

describe('View', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'theme_test'));
const themeDir = join(hexo.base_dir, 'themes', 'test');
const { compile } = Object.assign({}, hexo.extend.renderer.store.swig);

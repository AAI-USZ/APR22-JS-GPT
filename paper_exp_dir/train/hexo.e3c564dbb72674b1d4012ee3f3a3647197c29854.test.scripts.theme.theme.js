'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('Theme', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'theme_test'), {silent: true});
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

before(() => Promise.all([

'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const moment = require('moment');
const sinon = require('sinon');

describe('View', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'theme_test'));
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

'use strict';

require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const _ = require('lodash');

describe('Load config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});

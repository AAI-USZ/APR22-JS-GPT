'use strict';

const { sep, join } = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const { spy } = require('sinon');
const testUtil = require('../../util');
const { full_url_for } = require('hexo-util');

describe('Hexo', () => {
const base_dir = join(__dirname, 'hexo_test');
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(base_dir, {silent: true});
const coreDir = join(__dirname, '../../..');

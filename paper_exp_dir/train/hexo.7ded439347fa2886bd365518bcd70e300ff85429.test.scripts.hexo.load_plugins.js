'use strict';

const should = require('chai').should();
const fs = require('hexo-fs');
const pathFn = require('path');
const Promise = require('bluebird');

describe('Load plugins', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'plugin_test'), {silent: true});

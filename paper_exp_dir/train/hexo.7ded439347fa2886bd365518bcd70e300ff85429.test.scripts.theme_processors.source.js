'use strict';

const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('source', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'source_test'), {silent: true});

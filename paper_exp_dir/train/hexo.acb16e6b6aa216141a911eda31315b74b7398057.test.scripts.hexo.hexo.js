const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const sinon = require('sinon');
const sep = pathFn.sep;
const testUtil = require('../../util');

describe('Hexo', () => {
const base_dir = pathFn.join(__dirname, 'hexo_test');
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(base_dir, {silent: true});

const should = require('chai').should();
const pathFn = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');
const yaml = require('js-yaml');
const _ = require('lodash');

describe('File', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Box = require('../../../lib/box');
const box = new Box(hexo, pathFn.join(hexo.base_dir, 'file_test'));

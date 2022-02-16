const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('partial', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'partial_test'), {silent: true});
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');
const viewDir = pathFn.join(themeDir, 'layout') + pathFn.sep;

const ctx = {

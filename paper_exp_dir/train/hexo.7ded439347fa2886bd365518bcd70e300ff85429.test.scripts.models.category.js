'use strict';

require('chai').should();
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Category', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Category = hexo.model('Category');

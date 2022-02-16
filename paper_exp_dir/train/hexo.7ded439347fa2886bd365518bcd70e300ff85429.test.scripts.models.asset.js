'use strict';

require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');

describe('Asset', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Asset = hexo.model('Asset');

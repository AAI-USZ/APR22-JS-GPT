'use strict';

const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');

describe('Page', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Page = hexo.model('Page');

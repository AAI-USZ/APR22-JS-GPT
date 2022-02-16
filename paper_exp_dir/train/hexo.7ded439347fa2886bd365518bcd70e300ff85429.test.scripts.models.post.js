'use strict';

const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const Promise = require('bluebird');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();

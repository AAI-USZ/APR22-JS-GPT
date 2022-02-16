'use strict';

const should = require('chai').should();
const Promise = require('bluebird');
const fs = require('hexo-fs');
const pathFn = require('path');

describe('data', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = pathFn.join(__dirname, 'data_test');

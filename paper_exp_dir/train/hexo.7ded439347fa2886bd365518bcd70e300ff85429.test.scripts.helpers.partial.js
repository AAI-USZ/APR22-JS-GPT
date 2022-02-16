'use strict';

require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('partial', () => {
const Hexo = require('../../../lib/hexo');

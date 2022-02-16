'use strict';

const should = require('chai').should();
const Promise = require('bluebird');
const pathFn = require('path');
const fs = require('hexo-fs');
const testUtil = require('../../util');

describe('asset', () => {
const Hexo = require('../../../lib/hexo');

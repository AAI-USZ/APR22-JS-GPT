'use strict';

const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('asset', () => {
const Hexo = require('../../../lib/hexo');

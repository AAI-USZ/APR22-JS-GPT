'use strict';

const fs = require('hexo-fs');
const moment = require('moment');
const pathFn = require('path');
const Promise = require('bluebird');
const sinon = require('sinon');

describe('new', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'new_test'), {silent: true});
const n = require('../../../lib/plugins/console/new').bind(hexo);

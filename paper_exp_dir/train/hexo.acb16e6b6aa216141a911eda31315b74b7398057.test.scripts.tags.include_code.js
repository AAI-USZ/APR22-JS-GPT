'use strict';

const pathFn = require('path');
const should = require('chai').should();
const fs = require('hexo-fs');
const highlight = require('hexo-util').highlight;
const Promise = require('bluebird');

describe('include_code', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'include_code_test'));
const includeCode = Promise.method(require('../../../lib/plugins/tag/include_code')(hexo));
const path = pathFn.join(hexo.source_dir, hexo.config.code_dir, 'test.js');

const fixture = [

'use strict';

const Promise = require('bluebird');
const fs = require('hexo-fs');
const pathFn = require('path');

describe('data', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = pathFn.join(__dirname, 'data_test');
const hexo = new Hexo(baseDir);
const processor = require('../../../lib/plugins/processor/data')(hexo);
const process = Promise.method(processor.process).bind(hexo);

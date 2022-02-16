'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const { highlight, prismHighlight } = require('hexo-util');
const Promise = require('bluebird');

describe('include_code', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'include_code_test'));
const includeCode = Promise.method(require('../../../lib/plugins/tag/include_code')(hexo));
const path = pathFn.join(hexo.source_dir, hexo.config.code_dir, 'test.js');
const defaultCfg = JSON.parse(JSON.stringify(hexo.config));

const fixture = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

const code = args => includeCode(args.split(' '));


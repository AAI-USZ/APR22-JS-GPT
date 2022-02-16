'use strict';

const pathFn = require('path');
const osFn = require('os');
const fs = require('hexo-fs');
const yml = require('js-yaml');

describe('config flag handling', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'test_dir'));

const mcp = require('../../../lib/hexo/multi_config_path')(hexo);
const base = hexo.base_dir;


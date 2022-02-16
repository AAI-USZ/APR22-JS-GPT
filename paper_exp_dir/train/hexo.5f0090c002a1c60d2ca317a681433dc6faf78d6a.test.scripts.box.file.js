'use strict';

const { join } = require('path');
const { rmdir, stat, statSync, writeFile } = require('hexo-fs');
const { load } = require('js-yaml');

describe('File', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Box = require('../../../lib/box');
const box = new Box(hexo, join(hexo.base_dir, 'file_test'));
const { File } = box;

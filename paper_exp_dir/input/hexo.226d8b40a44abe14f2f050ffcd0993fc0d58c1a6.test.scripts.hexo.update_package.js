'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');

describe('Update package.json', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const updatePkg = require('../../../lib/hexo/update_package');
const packagePath = pathFn.join(hexo.base_dir, 'package.json');

beforeEach(() => {
hexo.env.init = false;
});


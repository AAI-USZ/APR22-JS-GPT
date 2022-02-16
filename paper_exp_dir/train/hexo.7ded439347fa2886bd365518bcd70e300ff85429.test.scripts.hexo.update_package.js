'use strict';

require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');

describe('Update package.json', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const updatePkg = require('../../../lib/hexo/update_package');

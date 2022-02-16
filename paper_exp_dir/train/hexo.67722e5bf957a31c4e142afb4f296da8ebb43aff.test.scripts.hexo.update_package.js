var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');

describe('Update package.json', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var updatePkg = require('../../../lib/hexo/update_package');
var packagePath = pathFn.join(hexo.base_dir, 'package.json');


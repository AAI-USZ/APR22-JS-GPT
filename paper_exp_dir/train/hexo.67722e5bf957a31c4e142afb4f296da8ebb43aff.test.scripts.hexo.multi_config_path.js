var pathFn = require('path');
var should = require('chai').should();
var fs = require('hexo-fs');
var yml = require('js-yaml');

describe('config flag handling', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'test_dir'));

var mcp = require('../../../lib/hexo/multi_config_path')(hexo);

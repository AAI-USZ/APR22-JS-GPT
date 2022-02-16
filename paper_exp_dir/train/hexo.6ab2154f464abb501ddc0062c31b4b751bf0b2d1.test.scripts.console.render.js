var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');

describe('render', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'render_test'), {silent: true});
var render = require('../../../lib/plugins/console/render').bind(hexo);

before(function(){

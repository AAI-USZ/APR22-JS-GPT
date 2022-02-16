var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var testUtil = require('../../util');

describe('Theme', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'theme_test'), {silent: true});
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');
var route = hexo.route;

function checkStream(stream, expected){
return testUtil.stream.read(stream).then(function(data){

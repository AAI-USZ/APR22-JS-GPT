var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var testUtil = require('../../util');

describe('generate', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'generate_test'), {silent: true});
var generate = require('../../../lib/plugins/console/generate').bind(hexo);

before(function(){
return fs.mkdirs(hexo.base_dir).then(function(){

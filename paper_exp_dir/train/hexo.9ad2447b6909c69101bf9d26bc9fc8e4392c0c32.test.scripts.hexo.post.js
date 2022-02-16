var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var post = hexo.post;

before(function(){
return hexo.init();
});

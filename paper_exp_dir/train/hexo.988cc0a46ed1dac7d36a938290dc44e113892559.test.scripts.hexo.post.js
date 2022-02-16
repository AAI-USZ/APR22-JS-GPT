var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var util = require('hexo-util');
var sinon = require('sinon');
var fixture = require('../../fixtures/post_render');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'post_test'));
var post = hexo.post;
var now = Date.now();
var clock;


var should = require('chai').should();
var fs = require('hexo-fs');
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('new', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var n = require('../../../lib/plugins/console/new').bind(hexo);
var post = hexo.post;
var now = Date.now();
var clock;


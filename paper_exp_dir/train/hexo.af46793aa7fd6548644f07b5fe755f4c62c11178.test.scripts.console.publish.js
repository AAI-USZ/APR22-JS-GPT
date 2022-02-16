'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('publish', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'publish_test'), {silent: true});
var publish = require('../../../lib/plugins/console/publish').bind(hexo);
var post = hexo.post;
var now = Date.now();
var clock;

before(function(){
clock = sinon.useFakeTimers(now);

return fs.mkdirs(hexo.base_dir).then(function(){
return hexo.init();
}).then(function(){
return hexo.scaffold.set('post', [
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'

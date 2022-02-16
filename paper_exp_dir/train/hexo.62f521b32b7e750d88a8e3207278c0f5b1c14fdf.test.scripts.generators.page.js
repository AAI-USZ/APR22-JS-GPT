'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var _ = require('lodash');

describe('page', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var Page = hexo.model('Page');
var generator = Promise.method(require('../../../lib/plugins/generator/page').bind(hexo));

function locals(){
hexo.locals.invalidate();

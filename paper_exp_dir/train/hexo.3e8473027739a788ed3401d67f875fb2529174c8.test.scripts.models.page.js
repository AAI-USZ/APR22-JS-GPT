'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');

describe('Page', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Page = hexo.model('Page');

it('default values', function(){
var now = Date.now();

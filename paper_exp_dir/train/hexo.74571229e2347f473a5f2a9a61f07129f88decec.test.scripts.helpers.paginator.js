'use strict';

var should = require('chai').should();

describe('paginator', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
page: {
base: ''

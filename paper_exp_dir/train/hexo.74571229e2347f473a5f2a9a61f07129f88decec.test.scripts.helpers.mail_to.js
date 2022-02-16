'use strict';

var should = require('chai').should();
var qs = require('querystring');

describe('mail_to', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {

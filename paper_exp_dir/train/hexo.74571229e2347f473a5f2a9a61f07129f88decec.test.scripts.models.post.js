'use strict';

var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Post = hexo.model('Post');

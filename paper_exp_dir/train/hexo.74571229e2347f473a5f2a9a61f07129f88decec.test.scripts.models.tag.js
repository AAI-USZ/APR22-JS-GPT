'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var _ = require('lodash');

describe('Tag', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Tag = hexo.model('Tag');

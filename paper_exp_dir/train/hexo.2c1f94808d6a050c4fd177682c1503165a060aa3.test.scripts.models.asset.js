'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var pathFn = require('path');

describe('Asset', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Asset = hexo.model('Asset');

it('default values', function(){
return Asset.insert({

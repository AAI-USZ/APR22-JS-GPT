'use strict';

var should = require('chai').should();
var Pattern = require('hexo-util').Pattern;

describe('Processor', function(){
var Processor = require('../../../lib/extend/processor');

it('register()', function(){
var p = new Processor();

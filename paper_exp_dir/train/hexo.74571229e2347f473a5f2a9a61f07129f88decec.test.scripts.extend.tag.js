'use strict';

var should = require('chai').should();

describe('Tag', function(){
var Tag = require('../../../lib/extend/tag');
var tag = new Tag();

it('register()', function(){
tag.register('test', function(args, content){
return args.join(' ');

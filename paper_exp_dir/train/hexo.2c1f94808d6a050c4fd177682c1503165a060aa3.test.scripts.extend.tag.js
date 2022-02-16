'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var Promise = require('bluebird');

describe('Tag', function(){
var Tag = require('../../../lib/extend/tag');
var tag = new Tag();

it('register()', function(){
var tag = new Tag();


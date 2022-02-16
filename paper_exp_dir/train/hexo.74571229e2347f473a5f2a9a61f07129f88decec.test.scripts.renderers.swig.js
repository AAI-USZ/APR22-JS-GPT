'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');

describe('swig', function(){
var r = require('../../../lib/plugins/renderer/swig');

it('normal', function(){
var body = [

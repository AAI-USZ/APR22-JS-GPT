'use strict';

var should = require('chai').should();

describe('json', function(){
var r = require('../../../lib/plugins/renderer/json');

it('normal', function(){
var data = {
foo: 1,
bar: {

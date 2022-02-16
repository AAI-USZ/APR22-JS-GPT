
var assert = require('assert')
var express = require('..');
var path = require('path')
var tmpl = require('./support/tmpl');

describe('app', function(){
describe('.render(name, fn)', function(){
it('should support absolute paths', function(done){
var app = createApp();

app.locals.user = { name: 'tobi' };

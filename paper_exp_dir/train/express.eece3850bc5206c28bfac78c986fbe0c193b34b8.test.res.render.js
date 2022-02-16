
var express = require('..');
var path = require('path')
var request = require('supertest');
var tmpl = require('./support/tmpl');

describe('res', function(){
describe('.render(name)', function(){
it('should support absolute paths', function(done){
var app = createApp();

app.locals.user = { name: 'tobi' };

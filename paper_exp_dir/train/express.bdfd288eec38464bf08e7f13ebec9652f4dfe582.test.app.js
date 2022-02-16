
var assert = require('assert')
var express = require('..')
var request = require('supertest')

describe('app', function(){
it('should inherit from event emitter', function(done){
var app = express();
app.on('foo', done);
app.emit('foo');
})

it('should be callable', function(){

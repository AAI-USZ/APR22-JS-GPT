
var assert = require('assert')
var express = require('../');
var request = require('supertest');

describe('middleware', function(){
describe('.next()', function(){
it('should behave like connect', function(done){
var app = express()
, calls = [];


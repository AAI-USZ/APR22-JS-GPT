
var express = require('..');
var methods = require('methods');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
describe('.send()', function(){
it('should set body to ""', function(done){
var app = express();


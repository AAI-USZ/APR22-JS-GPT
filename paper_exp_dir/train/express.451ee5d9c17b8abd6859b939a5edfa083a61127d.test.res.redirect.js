
var assert = require('assert')
var express = require('..');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
describe('.redirect(url)', function(){
it('should default to a 302 redirect', function(done){
var app = express();


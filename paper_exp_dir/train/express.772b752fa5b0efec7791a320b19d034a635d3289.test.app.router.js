
var express = require('../')
, request = require('./support/http')
, assert = require('assert');

describe('app.router', function(){
describe('methods supported', function(){
express.methods.forEach(function(method){
it('should include ' + method.toUpperCase(), function(done){
var app = express();
var calls = [];


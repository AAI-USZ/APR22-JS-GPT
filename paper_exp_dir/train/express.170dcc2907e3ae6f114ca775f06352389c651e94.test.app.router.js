
var express = require('../')
, request = require('./support/http')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
describe('methods supported', function(){
methods.forEach(function(method){
it('should include ' + method.toUpperCase(), function(done){

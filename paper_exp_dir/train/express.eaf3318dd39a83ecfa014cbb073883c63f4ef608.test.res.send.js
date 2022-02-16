
var assert = require('assert');
var express = require('..');
var methods = require('methods');
var request = require('supertest');

describe('res', function(){
describe('.send(null)', function(){
it('should set body to ""', function(done){
var app = express();


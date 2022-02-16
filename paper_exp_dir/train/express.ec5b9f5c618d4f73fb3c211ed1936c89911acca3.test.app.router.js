
var after = require('after');
var express = require('../')
, request = require('supertest')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
it('should restore req.params after leaving router', function(done){
var app = express();
var router = new express.Router();

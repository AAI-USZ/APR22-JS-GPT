
var express = require('../')
, request = require('supertest')
, assert = require('assert')
, methods = require('methods');

describe('app.router', function(){
it('should restore req.params after leaving router', function(done){
var app = express();
var router = new express.Router();

function handler1(req, res, next){
res.setHeader('x-user-id', req.params.id);
next()
}

function handler2(req, res){
res.send(req.params.id);

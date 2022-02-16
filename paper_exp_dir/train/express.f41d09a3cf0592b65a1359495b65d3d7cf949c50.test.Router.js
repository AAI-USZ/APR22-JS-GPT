
var express = require('../')
, Router = express.Router
, methods = require('methods')
, assert = require('assert');

describe('Router', function(){

describe('.middleware', function(){
it('should dispatch', function(done){
var router = new Router();

router.route('/foo').get(function(req, res){

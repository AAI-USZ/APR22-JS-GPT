var express = require('../')
, request = require('./support/http');

describe('app', function(){
describe('.VERB()', function(){
it('should only call an error handling routing callback when an error is propagated', function(done){
var app = express();

var a = false;
var b = false;
var c = false;
var d = false;

app.get('/', function(req, res, next){
next(new Error('fabricated error'));
}, function(req, res, next) {
a = true;
next();

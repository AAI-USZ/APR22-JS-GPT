
var express = require('../')
, request = require('./support/http')
, cookieParser = require('cookie-parser')

describe('req', function(){
describe('.signedCookies', function(){
it('should return a signed JSON cookie', function(done){
var app = express();

app.use(cookieParser('secret'));


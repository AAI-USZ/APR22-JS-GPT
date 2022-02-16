
var express = require('../')
, request = require('./support/http');

describe('req', function(){
describe('.signedCookies', function(){
it('should return a signed JSON cookie', function(done){
var app = express();

var replacer = app.get('json replacer');
var spaces = app.get('json spaces');

app.use(express.cookieParser('secret'));

app.use(function(req, res){
res.send(req.signedCookies);
});



var express = require('../')
, res = express.response;

describe('res', function(){

beforeEach(function() {
res.removeHeader('link');
});

describe('.links(obj)', function(){
it('should set Link header field', function(){
res.links({
next: 'http://api.example.com/users?page=2',
last: 'http://api.example.com/users?page=5'

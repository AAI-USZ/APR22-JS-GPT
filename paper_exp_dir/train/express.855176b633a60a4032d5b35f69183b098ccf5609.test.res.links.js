
var express = require('..');
var request = require('supertest');

describe('res', function(){
describe('.links(obj)', function(){
it('should set Link header field', function (done) {
var app = express();

app.use(function (req, res) {
res.links({
next: 'http://api.example.com/users?page=2',
last: 'http://api.example.com/users?page=5'

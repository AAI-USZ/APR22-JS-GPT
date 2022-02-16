
var app = require('../../examples/downloads/app')
, request = require('../support/http');

describe('downloads', function(){
describe('GET /', function(){
it('should have a link to amazing.txt', function(done){
request(app)
.get('/')
.expect(/href="\/files\/amazing.txt"/, done)

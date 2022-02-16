
var app = require('../../examples/error')
, request = require('../support/http');

describe('error', function(){
describe('GET /', function(){
it('should respond with 500', function(done){
request(app)
.get('/')
.expect(500,done)

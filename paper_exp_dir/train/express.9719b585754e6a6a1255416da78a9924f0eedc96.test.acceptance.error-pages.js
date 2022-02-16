
var app = require('../../examples/error-pages')
, request = require('../support/http');

describe('error-pages', function(){
describe('GET /', function(){
it('should respond with page list', function(done){
request(app)
.get('/')
.expect(/Pages Example/, done)

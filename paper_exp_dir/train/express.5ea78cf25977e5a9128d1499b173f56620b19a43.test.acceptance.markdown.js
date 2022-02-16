
var app = require('../../examples/markdown')
, request = require('../support/http');

describe('markdown', function(){
describe('GET /', function(){
it('should respond with html', function(done){
request(app)
.get('/')
.expect(/<h1>Markdown Example<\/h1>/,done)

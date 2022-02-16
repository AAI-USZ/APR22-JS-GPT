
var app = require('../../examples/cookies/app')
, request = require('../support/http');

describe('cookies', function(){
describe('GET /', function(){
it('should have a form', function(done){
request(app)
.get('/')
.expect(/<form/, done);

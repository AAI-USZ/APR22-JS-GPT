
var app = require('../../examples/cookies')
, request = require('supertest');
var utils = require('../support/utils');

describe('cookies', function(){
describe('GET /', function(){
it('should have a form', function(done){
request(app)
.get('/')
.expect(/<form/, done);
})


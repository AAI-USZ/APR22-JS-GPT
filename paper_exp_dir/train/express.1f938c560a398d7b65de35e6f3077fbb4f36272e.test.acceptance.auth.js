var app = require('../../examples/auth/app')
var request = require('supertest')

function getCookie(res) {
return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', function(){
describe('GET /',function(){
it('should redirect to /login', function(done){
request(app)
.get('/')

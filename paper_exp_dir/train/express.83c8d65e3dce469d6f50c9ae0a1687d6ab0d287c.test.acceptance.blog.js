var app = require('../../examples/blog/app')
, request = require('../support/http');

var authorization = 'Basic '+Buffer('admin:express').toString('base64');

function redirects(to,fn){
return function(res){
res.statusCode.should.equal(302)
res.headers.should.have.property('location').match(to);
fn()
}
}

describe('blog', function(){
describe('GET /', function(){
it('should have no posts', function(done){
request(app)
.get('/')
.expect(/you have no posts/, done)
})
})

describe('GET /post/add', function(){
it('should require auth', function(done){
request(app)
.get('/post/add')
.expect(401, done)
})

it('should login', function(done){
request(app)
.get('/post/add')
.set('Authorization',authorization)
.expect(/<h1>New Post<\/h1>/, done)
})
})


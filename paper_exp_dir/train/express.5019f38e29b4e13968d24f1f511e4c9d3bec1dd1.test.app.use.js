
var express = require('../')
, request = require('supertest');

describe('app', function(){
it('should emit "mount" when mounted', function(done){
var blog = express()
, app = express();

blog.on('mount', function(arg){
arg.should.equal(app);
done();
});

app.use(blog);
})

it('should reject numbers', function(){
var app = express();
app.use.bind(app, 3).should.throw(/Number/);
})

describe('.use(app)', function(){
it('should mount the app', function(done){
var blog = express()
, app = express();

blog.get('/blog', function(req, res){

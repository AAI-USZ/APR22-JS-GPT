
var after = require('after');
var express = require('..');
var request = require('supertest');

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

describe('.use(app)', function(){
it('should mount the app', function(done){
var blog = express()
, app = express();

blog.get('/blog', function(req, res){
res.end('blog');
});

app.use(blog);


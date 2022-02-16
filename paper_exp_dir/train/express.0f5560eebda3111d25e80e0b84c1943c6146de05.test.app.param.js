
var express = require('../')
, request = require('./support/http');

describe('app', function(){
describe('.param(fn)', function(){
it('should map app.param(name, ...) logic', function(done){
var app = express();

app.param(function(name, regexp){
if (regexp instanceof RegExp) {
return function(req, res, next, val){
var captures;
if (captures = regexp.exec(String(val))) {
req.params[name] = captures[1];
next();
} else {
next('route');
}
}
}
})

app.param(':name', /^([a-zA-Z]+)$/);

app.get('/user/:name', function(req, res){
res.send(req.params.name);
});

request(app)
.get('/user/tj')
.end(function(err, res){
res.text.should.equal('tj');
request(app)
.get('/user/123')
.expect(404, done);
});

})
})

describe('.param(names, fn)', function(){
it('should map the array', function(done){
var app = express();

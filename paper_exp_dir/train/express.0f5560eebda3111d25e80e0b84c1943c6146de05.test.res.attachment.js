
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.attachment()', function(){
it('should Content-Disposition to attachment', function(done){
var app = express();

app.use(function(req, res){
res.attachment().send('foo');
});

request(app)
.get('/')
.expect('Content-Disposition', 'attachment', done);
})
})

describe('.attachment(filename)', function(){
it('should add the filename param', function(done){
var app = express();

app.use(function(req, res){
res.attachment('/path/to/image.png');


var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.redirect(url)', function(){
it('should respect X-Forwarded-Proto when "trust proxy" is enabled', function(done){
var app = express();

app.enable('trust proxy');

app.use(function(req, res){
res.redirect('/login');
});

request(app)
.get('/')
.set('Host', 'example.com')

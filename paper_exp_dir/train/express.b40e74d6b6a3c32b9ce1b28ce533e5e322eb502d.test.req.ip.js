
var express = require('../')
, request = require('supertest');

describe('req', function(){
describe('.ip', function(){
describe('when X-Forwarded-For is present', function(){
describe('when "trust proxy" is enabled', function(){
it('should return the client addr', function(done){
var app = express();

app.enable('trust proxy');

app.use(function(req, res, next){
res.send(req.ip);
});

request(app)
.get('/')
.set('X-Forwarded-For', 'client, p1, p2')
.expect('client', done);
})

it('should return the addr after trusted proxy', function(done){
var app = express();

app.set('trust proxy', 2);

app.use(function(req, res, next){
res.send(req.ip);
});

request(app)
.get('/')
.set('X-Forwarded-For', 'client, p1, p2')
.expect('p1', done);
})

it('should return the addr after trusted proxy, from sub app', function (done) {
var app = express();
var sub = express();

app.set('trust proxy', 2);
app.use(sub);

sub.use(function (req, res, next) {
res.send(req.ip);

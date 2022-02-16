
var express = require('../')
, request = require('./support/http');

describe('req', function(){
describe('.ips', function(){
describe('when X-Forwarded-For is present', function(){
describe('when "trust proxies" is enabled', function(){
it('should return an array of the specified addresses', function(done){
var app = express();

app.enable('trust proxy');

app.use(function(req, res, next){
res.send(req.ips);
});


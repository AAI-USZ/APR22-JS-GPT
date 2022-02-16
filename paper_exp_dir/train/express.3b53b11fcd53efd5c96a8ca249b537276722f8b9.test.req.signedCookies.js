
var express = require('../')
, request = require('./support/http');

describe('req', function(){
describe('.signedCookies', function(){
it('should return a signed JSON cookie', function(done){
var app = express();

app.use(express.cookieParser('secret'));

app.use(function(req, res){
if ('/set' == req.path) {
res.cookie('obj', { foo: 'bar' }, { signed: true });
res.end();
} else {
res.send(req.signedCookies);
}
});

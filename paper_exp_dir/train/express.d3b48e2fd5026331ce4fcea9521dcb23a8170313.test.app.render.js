
var express = require('../')
, assert = require('assert');

describe('app', function(){
describe('.render(name, fn)', function(){
describe('when an error occurs', function(){
it('should invoke the callback', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');

app.render('user.jade', function(err, str){

process.nextTick(function(){
err.message.should.match(/user is not defined/);
done();
});
})
})
})

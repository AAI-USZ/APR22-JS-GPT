
var express = require('../')
, assert = require('assert');

describe('app', function(){
describe('.render(name, fn)', function(){
it('should expose app.locals', function(){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.render('user.jade', function(err, str){
assert(null == err);
str.should.equal('<p>tobi</p>');
})
})



var express = require('../');

describe('app', function(){
describe('.render(name, fn)', function(){
it('should support absolute paths', function(done){
var app = express();

app.locals.user = { name: 'tobi' };

app.render(__dirname + '/fixtures/user.jade', function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should expose app.locals', function(done){


var assert = require('assert')
var express = require('..');
var path = require('path')
var tmpl = require('./support/tmpl');

describe('app', function(){
describe('.render(name, fn)', function(){
it('should support absolute paths', function(done){
var app = createApp();

app.locals.user = { name: 'tobi' };

app.render(path.join(__dirname, 'fixtures', 'user.tmpl'), function (err, str) {
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should support absolute paths with "view engine"', function(done){
var app = createApp();

app.set('view engine', 'tmpl');
app.locals.user = { name: 'tobi' };

app.render(path.join(__dirname, 'fixtures', 'user'), function (err, str) {
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should expose app.locals', function(done){
var app = createApp();

app.set('views', path.join(__dirname, 'fixtures'))
app.locals.user = { name: 'tobi' };

app.render('user.tmpl', function (err, str) {
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should support index.<engine>', function(done){
var app = createApp();

app.set('views', path.join(__dirname, 'fixtures'))
app.set('view engine', 'tmpl');

app.render('blog/post', function (err, str) {
if (err) return done(err);
str.should.equal('<h1>blog post</h1>');
done();
})
})

it('should handle render error throws', function(done){
var app = express();

function View(name, options){
this.name = name;
this.path = 'fale';
}

View.prototype.render = function(options, fn){
throw new Error('err!');
};

app.set('view', View);

app.render('something', function(err, str){
err.should.be.ok()
err.message.should.equal('err!');
done();
})
})

describe('when the file does not exist', function(){
it('should provide a helpful error', function(done){
var app = createApp();

app.set('views', path.join(__dirname, 'fixtures'))
app.render('rawr.tmpl', function (err) {
assert.ok(err)
assert.equal(err.message, 'Failed to lookup view "rawr.tmpl" in views directory "' + path.join(__dirname, 'fixtures') + '"')
done();
});
})
})

describe('when an error occurs', function(){
it('should invoke the callback', function(done){
var app = createApp();

app.set('views', path.join(__dirname, 'fixtures'))

app.render('user.tmpl', function (err) {
assert.ok(err)
assert.equal(err.name, 'RenderError')
done()
})
})
})

describe('when an extension is given', function(){
it('should render the template', function(done){
var app = createApp();

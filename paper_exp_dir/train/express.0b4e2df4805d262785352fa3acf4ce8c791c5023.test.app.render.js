
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

it('should support absolute paths with "view engine"', function(done){
var app = express();

app.set('view engine', 'jade');
app.locals.user = { name: 'tobi' };

app.render(__dirname + '/fixtures/user', function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.render('user.jade', function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should support index.<engine>', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.render('blog/post', function(err, str){
if (err) return done(err);
str.should.equal('<h1>blog post</h1>');
done();
})
})

describe('when the file does not exist', function(){
it('should provide a helpful error', function(done){
var app = express();
app.set('views', __dirname + '/fixtures');
app.render('rawr.jade', function(err){
err.message.should.equal('Failed to lookup view "rawr.jade"');
done();
});
})
})

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

describe('when an extension is given', function(){
it('should render the template', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');

app.render('email.jade', function(err, str){
if (err) return done(err);
str.should.equal('<p>This is an email</p>');
done();
})
})
})

describe('when "view engine" is given', function(){
it('should render the template', function(done){
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/fixtures');

app.render('email', function(err, str){
if (err) return done(err);
str.should.equal('<p>This is an email</p>');
done();
})
})
})

describe('when a "view" constructor is given', function(){
it('should create an instance of it', function(done){
var app = express();

function View(name, options){
this.name = name;
this.path = 'path is required by application.js as a signal of success even though it is not used there.';
}

View.prototype.render = function(options, fn){

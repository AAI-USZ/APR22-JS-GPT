
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
err.should.be.ok;
err.message.should.equal('err!');
done();
})
})

describe('when the file does not exist', function(){
it('should provide a helpful error', function(done){
var app = express();
app.set('views', __dirname + '/fixtures');
app.render('rawr.jade', function(err){
err.message.should.equal('Failed to lookup view "rawr.jade" in views directory "' + __dirname + '/fixtures"');
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
fn(null, 'abstract engine');
};

app.set('view', View);

app.render('something', function(err, str){
if (err) return done(err);
str.should.equal('abstract engine');
done();
})
})
})

describe('caching', function(){
it('should always lookup view without cache', function(done){
var app = express();
var count = 0;

function View(name, options){
this.name = name;
this.path = 'fake';
count++;
}

View.prototype.render = function(options, fn){
fn(null, 'abstract engine');
};

app.set('view cache', false);
app.set('view', View);

app.render('something', function(err, str){
if (err) return done(err);
count.should.equal(1);
str.should.equal('abstract engine');
app.render('something', function(err, str){
if (err) return done(err);
count.should.equal(2);
str.should.equal('abstract engine');
done();
})
})
})

it('should cache with "view cache" setting', function(done){
var app = express();
var count = 0;

function View(name, options){
this.name = name;
this.path = 'fake';
count++;
}

View.prototype.render = function(options, fn){
fn(null, 'abstract engine');
};

app.set('view cache', true);
app.set('view', View);

app.render('something', function(err, str){
if (err) return done(err);
count.should.equal(1);
str.should.equal('abstract engine');
app.render('something', function(err, str){
if (err) return done(err);
count.should.equal(1);
str.should.equal('abstract engine');
done();
})
})
})
})
})

describe('.render(name, options, fn)', function(){
it('should render the template', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');

var user = { name: 'tobi' };

app.render('user.jade', { user: user }, function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.render('user.jade', {}, function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should give precedence to app.render() locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };
var jane = { name: 'jane' };

app.render('user.jade', { user: jane }, function(err, str){
if (err) return done(err);
str.should.equal('<p>jane</p>');
done();
})
})

describe('caching', function(){
it('should cache with cache option', function(done){
var app = express();
var count = 0;

function View(name, options){
this.name = name;
this.path = 'fake';
count++;
}

View.prototype.render = function(options, fn){
fn(null, 'abstract engine');
};

app.set('view cache', false);
app.set('view', View);

app.render('something', {cache: true}, function(err, str){
if (err) return done(err);
count.should.equal(1);
str.should.equal('abstract engine');
app.render('something', {cache: true}, function(err, str){
if (err) return done(err);
count.should.equal(1);
str.should.equal('abstract engine');
done();
})
})
})
})
})
})

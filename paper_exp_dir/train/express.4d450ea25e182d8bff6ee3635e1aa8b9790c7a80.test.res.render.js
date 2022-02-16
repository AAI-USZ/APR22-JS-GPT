
var express = require('../')
, request = require('./support/http');

describe('res', function(){
describe('.render(name)', function(){
it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render('user.jade');
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>tobi</p>');
done();
});
})

it('should support index.<engine>', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.use(function(req, res){
res.render('blog/post');
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<h1>blog post</h1>');
done();
});
})

describe('when an error occurs', function(){
it('should next(err)', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
res.render('user.jade');
});

app.use(function(err, req, res, next){
res.end(err.message);
});

request(app)
.get('/')
.end(function(res){
res.body.should.match(/user is not defined/);
done();
});
})
})

describe('when "view engine" is given', function(){
it('should render the template', function(done){
var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
res.render('email');
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>This is an email</p>');
done();
});
})
})
})

describe('.render(name, option)', function(){
it('should render the template', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');

var user = { name: 'tobi' };

app.use(function(req, res){
res.render('user.jade', { user: user });
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>tobi</p>');
done();
});
})

it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render('user.jade', {});
});

request(app)
.get('/')
.end(function(res){
res.body.should.equal('<p>tobi</p>');
done();
});
})

it('should expose res.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');

app.use(function(req, res){
res.locals.user = { name: 'tobi' };
res.render('user.jade', {});
});

request(app)
.get('/')
.end(function(res){

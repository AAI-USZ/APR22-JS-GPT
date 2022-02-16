
var express = require('../')
, request = require('supertest');

describe('res', function(){
describe('.render(name)', function(){
it('should support absolute paths', function(done){
var app = express();

app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render(__dirname + '/fixtures/user.jade');
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
})

it('should support absolute paths with "view engine"', function(done){
var app = express();

app.locals.user = { name: 'tobi' };
app.set('view engine', 'jade');

app.use(function(req, res){
res.render(__dirname + '/fixtures/user');
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
})

it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.use(function(req, res){
res.render('user.jade');
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
})

it('should expose app.locals with `name` property', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.name = 'tobi';

app.use(function(req, res){
res.render('name.jade');
});

request(app)
.get('/')
.expect('<p>tobi</p>', done);
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
.expect('<h1>blog post</h1>', done);
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
.expect(/Cannot read property '[^']+' of undefined/, done);
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
.expect('<p>This is an email</p>', done);
})
})

describe('when "views" is given', function(){
it('should lookup the file in the path', function(done){
var app = express();

app.set('views', __dirname + '/fixtures/default_layout');

app.use(function(req, res){
res.render('user.jade', { user: { name: 'tobi' } });
});


var express = require('../')
, request = require('./support/http');

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

var app = express();

app.set('views', __dirname + '/fixtures');

app.use(function(req, res){

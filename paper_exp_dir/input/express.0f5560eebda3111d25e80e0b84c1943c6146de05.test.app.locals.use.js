
var express = require('../')
, request = require('./support/http');

describe('app', function(){
describe('.locals.use(fn)', function(){
it('should run in parallel on res.render()', function(done){
var app = express();
var calls = [];
app.set('views', __dirname + '/fixtures');

app.locals.first = 'tobi';

app.locals.use(function(req, res, done){
process.nextTick(function(){
calls.push('one');
res.locals.last = 'holowaychuk';
done();
});
});

app.locals.use(function(req, res, done){
process.nextTick(function(){
calls.push('two');
res.locals.species = 'ferret';
done();
});
});

app.use(function(req, res){
calls.push('use');
res.render('pet.jade');
});

request(app)
.get('/')

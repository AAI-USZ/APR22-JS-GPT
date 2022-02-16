
var express = require('../')
, request = require('supertest')
, utils = require('../lib/utils')
, assert = require('assert');

var app1 = express();

app1.use(function(req, res, next){
res.format({
'text/plain': function(){
res.send('hey');
},

'text/html': function(){
res.send('<p>hey</p>');
},

'application/json': function(a, b, c){
assert(req == a);
assert(res == b);
assert(next == c);
res.send({ message: 'hey' });
}
});
});

app1.use(function(err, req, res, next){
if (!err.types) throw err;
res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app2 = express();

app2.use(function(req, res, next){
res.format({
text: function(){ res.send('hey') },
html: function(){ res.send('<p>hey</p>') },
json: function(){ res.send({ message: 'hey' }) }
});
});

app2.use(function(err, req, res, next){
res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app3 = express();

app3.use(function(req, res, next){
res.format({
text: function(){ res.send('hey') },
default: function(){ res.send('default') }
})
});

var app4 = express();

app4.get('/', function(req, res, next){
res.format({
text: function(){ res.send('hey') },
html: function(){ res.send('<p>hey</p>') },
json: function(){ res.send({ message: 'hey' }) }
});
});

app4.use(function(err, req, res, next){
res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app5 = express();

app5.use(function (req, res, next) {
res.format({
default: function () { res.send('hey') }
});
});

describe('res', function(){
describe('.format(obj)', function(){

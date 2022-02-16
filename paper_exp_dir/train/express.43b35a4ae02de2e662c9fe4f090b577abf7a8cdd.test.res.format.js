
var express = require('../')
, request = require('./support/http')
, utils = require('../lib/utils')
, assert = require('assert');

var app = express();

app.use(function(req, res, next){
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

app.use(function(err, req, res, next){
if (!err.types) throw err;
res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app2 = express();

app2.use(function(req, res, next){
res.format({
text: function(){ res.send('hey') },
html: function(){ res.send('<p>hey</p>') },

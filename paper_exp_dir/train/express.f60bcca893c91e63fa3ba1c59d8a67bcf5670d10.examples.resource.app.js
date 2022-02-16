


var express = require('../../lib/express');

var app = express.createServer();



app.resource = function(path, obj) {
this.get(path, obj.index);
this.get(path + '/:a..:b', function(req, res){
var a = parseInt(req.params.a, 10),
b = parseInt(req.params.b, 10);
obj.range(req, res, a, b);
});
this.get(path + '/:id', obj.show);
this.del(path + '/:id', obj.destroy);
};



var users = [
{ name: 'tj' },
{ name: 'ciaran' },
{ name: 'aaron' },
{ name: 'guillermo' },
{ name: 'simon' },
{ name: 'tobi' }
];



var User = {
index: function(req, res){
res.send(users);
},
show: function(req, res){
res.send(users[req.params.id] || { error: 'Cannot find user' });
},
destroy: function(req, res){
var id = req.params.id;
var destroyed = id in users;
delete users[id];
res.send(destroyed ? 'destroyed' : 'Cannot find user');

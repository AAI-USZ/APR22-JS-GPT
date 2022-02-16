


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
},
range: function(req, res, a, b){
res.send(users.slice(a, b+1));
}
};







app.resource('/users', User);

app.get('/', function(req, res){
res.send([
'<h1>Examples:</h1> <ul>',
'<li>GET /users</li>',
'<li>GET /users/1</li>',
'<li>GET /users/3</li>',
'<li>GET /users/1..3</li>',
'<li>DELETE /users/4</li>',
'</ul>',
].join('\n'));
});

app.listen(3000);
console.log('Express app started on port 3000');

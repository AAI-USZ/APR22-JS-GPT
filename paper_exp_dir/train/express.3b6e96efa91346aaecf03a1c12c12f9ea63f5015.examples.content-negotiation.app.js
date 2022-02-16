


var express = require('../../');


var app = module.exports = express();

var users = [
{ name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
];

function provides(type) {
return function(req, res, next){
if (req.accepts(type)) return next();



next('route');
}
}



app.get('/users', provides('json'), function(req, res){
res.send(users);
});



app.get('/users', provides('html'), function(req, res){
res.send('<ul>' + users.map(function(user){
return '<li>' + user.name + '</li>';
}).join('\n') + '</ul>');
});



app.get('/users', function(req, res, next){
res.type('txt');
res.send(users.map(function(user){
return user.name;
}).join(', '));
});


if (!module.parent) {
app.listen(3000);
console.log('Express server listening on port 3000');
}




var express = require('../../')
, app = module.exports = express();



var users = [
{ name: 'tj' }
, { name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
, { name: 'bandit' }
];



app.param(['to', 'from'], function(req, res, next, num, name){
req.params[name] = parseInt(num, 10);
if( isNaN(req.params[name]) ){
next(new Error('failed to parseInt '+num));
} else {
next();
}
});



app.param('user', function(req, res, next, id){
if (req.user = users[id]) {
next();
} else {
next(new Error('failed to find user'));
}
});



app.get('/', function(req, res){
res.send('Visit /user/0 or /users/0-2');
});



app.get('/user/:user', function(req, res, next){
res.send('user ' + req.user.name);
});



app.get('/users/:from-:to', function(req, res, next){
var from = req.params.from
, to = req.params.to
, names = users.map(function(user){ return user.name; });
res.send('users ' + names.slice(from, to).join(', '));
});


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}

var express = require('../../')
, app = module.exports = express()
, users = require('./db');



app.get('/', function(req, res){
res.format({
html: function(){
res.send('<ul>' + users.map(function(user){
return '<li>' + user.name + '</li>';
}).join('') + '</ul>');
},

text: function(){
res.send(users.map(function(user){
return ' - ' + user.name + '\n';
}).join(''));
},

json: function(){
res.json(users);
}
})
});





function format(path) {
var requestHandler = require(path);
return function(req, res){
res.format(requestHandler);
}
}

app.get('/users', format('./users'));

if (!module.parent) {
app.listen(3000);
console.log('listening on port 3000');
}

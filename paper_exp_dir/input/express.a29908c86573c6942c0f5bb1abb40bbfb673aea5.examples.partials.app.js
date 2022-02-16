
require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();



app.set('views', __dirname + '/views');




app.set('view engine', 'jade');


var ninja = {
name: 'leonardo',
summary: { email: 'hunter.loftis+github@gmail.com', master: 'splinter', description: 'peaceful leader' },
weapons: ['katana', 'fists', 'shell'],
victims: ['shredder', 'brain', 'beebop', 'rocksteady']

app.get('/', function(req, res){
res.render('ninjas/show', { ninja: ninja });
});

app.listen(3000);
console.log('Express app started on port 3000');

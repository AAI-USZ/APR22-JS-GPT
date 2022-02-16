


var express = require('./../../lib/express');



var app = express.createServer();

app.get('/', function(req, res){
res.send('<p>Visit /blog</p>');
});


app.use('/blog', require('./blog'));

app.listen(3000);

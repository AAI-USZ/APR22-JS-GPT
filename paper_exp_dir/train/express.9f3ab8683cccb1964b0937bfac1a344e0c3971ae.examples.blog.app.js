


var express = require('./../../lib/express');



var app = module.exports = express.createServer();



require('./main');
require('./contact');



app.use('/blog', require('./blog'));

app.listen(3000);

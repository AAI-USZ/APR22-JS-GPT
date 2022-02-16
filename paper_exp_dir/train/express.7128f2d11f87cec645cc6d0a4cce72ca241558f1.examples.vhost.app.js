


var express = require('../../lib/express');





var one = express.createServer();

one.use(express.logger());

one.get('/', function(req, res){
res.send('Hello from app one!')
});


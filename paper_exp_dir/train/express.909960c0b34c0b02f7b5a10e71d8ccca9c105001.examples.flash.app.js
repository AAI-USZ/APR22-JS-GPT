


var express = require('../../lib/express');



var app = express.createServer(
express.cookieParser()
, express.session({ secret: 'keyboard cat' })
);




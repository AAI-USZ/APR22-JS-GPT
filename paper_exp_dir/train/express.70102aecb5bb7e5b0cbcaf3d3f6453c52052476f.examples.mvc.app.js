

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();

require('./mvc').boot(app);

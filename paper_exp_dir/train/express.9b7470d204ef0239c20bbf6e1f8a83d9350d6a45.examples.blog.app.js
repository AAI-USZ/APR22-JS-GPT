

require.paths.unshift(__dirname + '/../../support');



var express = require('./../../lib/express');



var app = module.exports = express.createServer();



require('./main');
require('./contact');


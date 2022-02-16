

require.paths.unshift(__dirname + '/../../support');



var express = require('./../../lib/express');



var pub = __dirname + '/public';




var app = express.createServer(
express.compiler({ src: pub, enable: ['sass'] }),



require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');

var app = express.createServer();









var users = [
{ id: 0, name: 'tj', email: 'tj@vision-media.ca', role: 'member' }

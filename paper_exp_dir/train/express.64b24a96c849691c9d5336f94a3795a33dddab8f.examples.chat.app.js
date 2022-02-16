


var app = module.exports = require('express').createApplication([
{ filter: 'log' },
{ filter: 'method-override' },
{ filter: 'cookie' },
{ filter: 'session' },
{ filter: 'body-decoder' },
{ provider: 'sass', root: __dirname + '/public' },
{ provider: 'static', root: __dirname + '/public' },

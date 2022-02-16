


process.mixin(GLOBAL, require("sys"))
var http = require("http")

Express = {
version: '0.0.1',
utilities: {},
modules: [],
routes: [],
responseCodes : {
100: 'Continue',
101: 'Switching Protocols',
200: 'OK',
201: 'Created',
202: 'Accepted',

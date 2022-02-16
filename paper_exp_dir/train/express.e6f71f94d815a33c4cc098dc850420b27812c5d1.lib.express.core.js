

process.mixin(GLOBAL, require("sys"));

http = require("http");

Express = {
version : '0.0.1',
utilities : {},
modules  : [],
routes  : [],
STATUS_CODES : {
100 : 'Continue',
101 : 'Switching Protocols',

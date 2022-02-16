


(function(){
var http = require("http");
process.mixin(GLOBAL, require("sys"));

Express = {
version : '0.0.1',
utilities : {},
modules  : [],
routes  : [],
STATUS_CODES : {
100 : 'Continue',

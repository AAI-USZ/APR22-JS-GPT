




var sys = require('sys'),
style = require('express/pages/style').style




function stack(e) {
if (e.stack)
return e.stack.split('\n').slice(1).map(function(val, i){

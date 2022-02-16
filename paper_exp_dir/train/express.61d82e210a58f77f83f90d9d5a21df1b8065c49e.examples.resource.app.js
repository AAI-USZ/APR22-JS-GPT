


var express = require('../../lib/express');

var app = express.createServer();



app.resource = function(path, obj) {
this.get(path, obj.index);
this.get(path + '/:id', obj.show);
this.del(path + '/:id', obj.destroy);
};



var users = [
{ name: 'tj' },
{ name: 'ciaran' },
{ name: 'aaron' },
{ name: 'guillermo' },
{ name: 'simon' },
{ name: 'tobi' }
];



var User = {
index: function(req, res){




var express = require('../../lib/express');

var app = express.createServer();



app.resource = function(path, obj) {
this.get(path, obj.index);
this.get(path + '/:a..:b.:format?', function(req, res){
var a = parseInt(req.params.a, 10)
, b = parseInt(req.params.b, 10)
, format = req.params.format;
obj.range(req, res, a, b, format);
});
this.get(path + '/:id', obj.show);
this.del(path + '/:id', obj.destroy);
};



var users = [

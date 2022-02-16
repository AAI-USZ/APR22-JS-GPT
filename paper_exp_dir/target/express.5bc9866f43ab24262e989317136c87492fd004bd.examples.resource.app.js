this.get(path + '/:a..:b', function(req, res, params){
var a = parseInt(params.a, 10),
b = parseInt(params.b, 10);

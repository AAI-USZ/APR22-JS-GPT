app.get('/json/:n', function(req, res){
var n = ~~req.params.n;
var arr = [];

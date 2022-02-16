app.get('/json', function(req, res, next){
res.contentType('json');
res.send('{"foo":"bar"}');

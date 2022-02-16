app.get('/error', function(req, res){
res.render('invalid.jade', { layout: false }, function(err){
res.send(err.arguments[0]);

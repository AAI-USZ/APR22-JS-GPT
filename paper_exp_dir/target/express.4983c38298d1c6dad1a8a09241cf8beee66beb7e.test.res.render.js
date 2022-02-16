it('should expose app.locals with `name` property', function(done){
app.locals.name = 'tobi';
res.render('name.jade');

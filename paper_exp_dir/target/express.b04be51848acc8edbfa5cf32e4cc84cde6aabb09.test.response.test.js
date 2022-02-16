'test #status()': function(){
app.get('/error', function(req, res, next){
res.status(500).send('OH NO');

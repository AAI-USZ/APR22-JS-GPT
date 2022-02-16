app.get('/li', function(req, res){
res.partial('li', { object: 'Testing', as: 'value' });

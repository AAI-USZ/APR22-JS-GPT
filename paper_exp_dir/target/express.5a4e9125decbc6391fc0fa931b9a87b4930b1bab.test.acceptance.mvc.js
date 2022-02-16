.set('Content-Type', 'application/x-www-form-urlencoded')
.send({ pet: { name: 'Boots' } })
.end(function(err, res){

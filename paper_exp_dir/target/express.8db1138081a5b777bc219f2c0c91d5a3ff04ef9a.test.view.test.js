app.get('/movie', function(req, res){
res.send(res.partial('movie.jade', {
object: movies[0]

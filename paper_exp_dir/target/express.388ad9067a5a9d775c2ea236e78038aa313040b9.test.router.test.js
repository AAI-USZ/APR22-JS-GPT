app.get('/user/:user', [allow('member'), [[restrictAge(18)]]], function(req, res){

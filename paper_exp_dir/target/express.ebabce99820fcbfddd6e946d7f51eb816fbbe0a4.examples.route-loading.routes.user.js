app.get('/users', function(req, res){
res.render('user/list', { users: db.users });
});



var users = [
{ name: 'TJ', email: 'tj@vision-media.ca' },
{ name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
res.render('users', { title: 'Users', users: users });
};

exports.load = function(req, res, next){

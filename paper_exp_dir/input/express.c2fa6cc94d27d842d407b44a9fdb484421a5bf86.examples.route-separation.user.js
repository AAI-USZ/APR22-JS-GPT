


var users = [
];

exports.list = function(req, res){
res.render('users', { title: 'Users', users: users });
};

exports.load = function(req, res, next){
var id = req.params.id;
req.user = users[id];
if (req.user) {
next();
} else {
next(new Error('cannot find user ' + id));
}
};

exports.view = function(req, res){
res.render('users/view', {

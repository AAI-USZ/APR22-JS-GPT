


var users = [
{ name: 'TJ', email: 'tj@vision-media.ca' },
{ name: 'Simon', email: 'simon@vision-media.ca' }
];

module.exports = {



index: function(req, res){
},



show: function(req, res, next){
var id = req.params.id,
user = users[id];
if (user) {
} else {
next(new Error('User ' + id + ' does not exist'));
}
}
};

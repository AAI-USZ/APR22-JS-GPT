

var db = require('../../db');

exports.before = function(req, res, next){
var id = req.params.user_id;
if (!id) return next();

process.nextTick(function(){
req.user = db.users[id];


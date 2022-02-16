

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = function(req, res, next){
var id = req.params.user_id;
var user = db.users[id];
var body = req.body;

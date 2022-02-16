

var db = require('../../db');

exports.engine = 'jade';

exports.before = function(req, res, next){
var pet = db.pets[req.params.pet_id];
if (!pet) return next(new Error('Pet not found'));
req.pet = pet;
next();

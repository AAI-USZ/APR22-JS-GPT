
var db = require('../../db');

exports.engine = 'jade';

exports.before = function(req, res, next){
var pet = db.pets[req.params.pet_id];
if (!pet) return next(new Error('Pet not found'));
req.pet = pet;
next();
};

exports.show = function(req, res, next){
res.render('show', { pet: req.pet });
};

exports.edit = function(req, res, next){

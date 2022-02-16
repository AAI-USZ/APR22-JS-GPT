var schemas = require('./schema');



var Model = module.exports = function(db){
var models = {};

var model = function(name){
return models[name];
};




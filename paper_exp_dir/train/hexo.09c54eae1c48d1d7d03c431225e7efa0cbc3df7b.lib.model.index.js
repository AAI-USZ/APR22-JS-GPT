

var Model = module.exports = function(db){
var models = {};

var model = function(name){
return models[name];
};



model.register = function(name, schema, method){

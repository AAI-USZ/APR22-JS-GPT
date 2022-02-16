

var Model = module.exports = function(db){
var models = {};

var model = function(name){
return models[name];
};



model.register = function(name, schema, method){
if (!schema) schema = {};

var model;

if (method){
if (method.hooks){
if (method.hooks.pre) schema.pres = method.hooks.pre;
if (method.hooks.post) schema.posts = method.hooks.post;
}

if (method.statics) schema.statics = method.statics;
if (method.methods) schema.methods = method.methods;

model = db.model(name, schema);
} else {
model = db.model(name, schema);
}

models[name] = model;
};


model.save = db.save.bind(db);



model.Schema = require('warehouse').Schema;

var _ = require('lodash');

var store = {};



var Locals = module.exports = function(locals){
_.extend(store, locals);
};



Locals.forEach = Locals.each = function(iterator){
_.each(store, iterator);
};



Locals._generate = function(){
var obj = {};

this.each(function(val, name){
obj[name] = typeof val === 'function' ? val() : val;
});

return obj;
};

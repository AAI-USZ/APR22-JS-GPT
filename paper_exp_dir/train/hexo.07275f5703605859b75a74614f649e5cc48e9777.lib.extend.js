var _ = require('underscore');

var store = {
generator: [],
renderer: {},
rendererSync: {},
helper: {}
};

exports.generator = {
list: function(){
return store.generator;
},
register: function(method){
store.generator.push(method);
}
};

var rendererFn = exports.renderer = {
list: function(){
return store.renderer;
},
register: function(tag, output, method, sync){
if (sync){
store.rendererSync[tag] = method;
store.rendererSync[tag].output = output;

store.renderer[tag] = function(){
var args = _.toArray(arguments),
callback = args.pop();

callback(null, method.apply(null, args));
};
} else {

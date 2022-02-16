var _ = require('lodash');

var store = {
generator: [],
renderer: {},
rendererSync: {},
helper: {},
deployer: {},
processor: [],
tag: {},
console: {},
migrator: {}
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

try {
callback(null, method.apply(null, args));
} catch (err){
callback(err);
}
};
} else {
store.renderer[tag] = method;
}

store.renderer[tag].output = output;
}

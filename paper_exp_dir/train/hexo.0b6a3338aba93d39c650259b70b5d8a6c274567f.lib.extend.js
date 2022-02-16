var _ = require('underscore');

var store = {
generator: [],
renderer: {},
rendererSync: {},
helper: {},
deployer: {},
processor: [],
tag: {},
console: {},
migrator: {},
filter: {}
};

exports.generator = {
list: function(){
return store.generator;
},
register: function(method){
store.generator.push(method);

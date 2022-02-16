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

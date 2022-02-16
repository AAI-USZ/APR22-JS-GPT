var _ = require('underscore');

var store = {
generator: [],
renderer: {},
rendererSync: {},
helper: {},
preprocessor: [],
tag: {}
};

exports.generator = {
list: function(){
return store.generator;
},
register: function(method){

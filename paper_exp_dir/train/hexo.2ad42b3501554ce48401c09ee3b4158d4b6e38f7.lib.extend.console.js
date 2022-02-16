var Promise = require('bluebird'),
abbrev = require('abbrev');

function Console(){
this.store = {};
this.alias = {};
}

Console.prototype.get = function(name){
name = name.toLowerCase();
return this.store[this.alias[name]];
};

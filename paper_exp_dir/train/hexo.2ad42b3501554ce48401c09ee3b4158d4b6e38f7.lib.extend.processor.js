var Promise = require('bluebird'),
Pattern = require('../box/pattern');

function Processor(){
this.store = [];
}

Processor.prototype.list = function(){
return this.store;
};

Processor.prototype.register = function(pattern, fn){
if (!fn){
if (typeof pattern === 'function'){
fn = pattern;

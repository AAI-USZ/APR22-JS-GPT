var _ = require('underscore'),
single = require('./single');

function Query(index, fields, parent){
this.index = index;
this.fields = fields;

this.__defineGetter__('parent', function(){
return parent;
});

this.__defineSetter__('parent', function(obj){
parent = obj;

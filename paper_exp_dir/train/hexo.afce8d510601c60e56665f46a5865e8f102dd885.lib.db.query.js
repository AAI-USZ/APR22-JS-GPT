var _ = require('underscore');

function Query(index, fields, parent){
this.index = index;
this.fields = fields;
this.parent = parent;

this.__defineGetter__('length', function(){
return this.index.length;
});

this.parent.on('remove', function(id){
var position = index.indexOf(id);

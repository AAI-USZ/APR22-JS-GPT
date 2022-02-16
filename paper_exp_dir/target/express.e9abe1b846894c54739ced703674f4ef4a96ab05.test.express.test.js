map.mounted(function(parent){
called = true;
assert.equal(this, map, 'mounted() is not in context of the child app');

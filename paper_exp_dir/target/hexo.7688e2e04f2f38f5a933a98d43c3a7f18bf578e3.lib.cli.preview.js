watch(function(ev, callback){
var oldList = Object.keys(route.list());
generate({watch: true}, function(err, cache){

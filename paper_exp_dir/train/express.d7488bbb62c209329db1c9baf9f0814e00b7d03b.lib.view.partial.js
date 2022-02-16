




var cache = {};



exports.resolveObjectName = function(view){
return cache[view] || (cache[view] = view
.split('/')
.slice(-1)[0]
.split('.')[0]
.replace(/^_/, '')
.replace(/[^a-zA-Z0-9 ]+/g, ' ')
.split(/ +/).map(function(word, i){

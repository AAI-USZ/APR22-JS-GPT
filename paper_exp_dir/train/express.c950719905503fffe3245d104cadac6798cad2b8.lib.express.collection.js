




$break = '__break__'



function callback(fn) {
if (fn === undefined) return
return fn instanceof Function ? fn :
fn.length < 4 ?
Function('a, b, c', 'return a ' + fn + ' b') :
Function('a, b, c', 'return ' + fn)
}



Collection = Class({



init: function(arr) {

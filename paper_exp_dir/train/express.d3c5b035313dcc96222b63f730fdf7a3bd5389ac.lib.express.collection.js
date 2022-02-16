




$break = '__break__'



function callback(fn) {
if (fn === undefined) return
if (fn instanceof Function) return fn
if (fn.length < 4) return Function('a, b, c', 'return a ' + fn + ' b')
return Function('a, b, c', 'return ' + fn)
}



Collection = Class({



init: function(arr) {
this.arr = arr
},

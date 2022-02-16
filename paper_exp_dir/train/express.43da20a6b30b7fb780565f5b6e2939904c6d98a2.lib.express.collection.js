




$break = '__break__'

var property = /^\w+$/,
method = /^\w+\(/



function callback(fn) {
if (fn === undefined) return
if (fn instanceof Function) return fn
if (fn.length < 4) return Function('a, b, c', 'return a ' + fn + ' b')
if (property.test(fn) || method.test(fn)) fn = 'a.' + fn
return Function('a, b, c', 'return ' + fn)
}



Collection = Class({



init: function(arr) {
this.arr = arr || []
},


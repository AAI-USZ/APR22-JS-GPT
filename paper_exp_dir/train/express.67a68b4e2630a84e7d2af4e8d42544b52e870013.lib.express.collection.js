




$break = '__break__'



function callback(fn) {
return fn instanceof Function ? fn :
fn.length < 4 ?
Function('a, b, c', 'return a ' + fn + ' b') :
Function('a, b, c', 'return ' + fn)
}



Collection = Class({



init: function(arr) {
this.arr = arr
},



at: function(index) {
if ('length' in this.arr)
return this.arr[index]
var result, i = 0
this.each(function(val){
if (i++ == index) {
result = val
throw $break
}
})
return result
},



each: function(fn) {
try {
if (this.arr.forEach)
this.arr.forEach(fn)
else
for (var key in this.arr)
if (this.arr.hasOwnProperty(key))
fn(this.arr[key], key)
}
catch (e) {
if (e != $break) throw e
}
return this
},



reverse: function() {
if (this.arr.reverse)
return $(this.arr.reverse())
return this
},



reduce: function(memo, fn) {
fn = callback(fn)

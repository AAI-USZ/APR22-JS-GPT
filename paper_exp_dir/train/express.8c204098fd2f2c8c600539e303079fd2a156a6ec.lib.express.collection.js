




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



reduce: function(memo, fn) {
fn = callback(fn)
if (this.arr.reduce)
return this.arr.reduce(fn, memo)
this.each(function(val, key){
memo = fn(memo, val, key)
})
return memo
},



map: function(fn) {
fn = callback(fn)
if (this.arr.map)
return $(this.arr.map(fn))
return $(this.reduce([], function(array, val, key){
array.push(fn(val, key))
return array
}))
},



select: function(fn) {
fn = callback(fn)
return $(this.reduce([], function(array, val, key){
if (fn(val, key))
array.push(val)
return array
}))
},



reject: function(fn) {
fn = callback(fn)

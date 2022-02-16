




$break = '__break__'

var property = /^\w+$/,
method = /^\w+\(/



function callback(fn) {
if (fn === undefined) return
if (fn instanceof Function) return fn
if (fn.length < 4) return Function('a, b, c', 'return a ' + fn + ' b')
if (property.test(fn) ||
method.test(fn)) fn = 'a.' + fn
return Function('a, b, c', 'return ' + fn)
}



Collection = Class({



init: function(arr) {
this.arr = arr || []
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



join: function(str) {
return this.toArray().join(str || '')
},



sort: function(fn) {
fn = callback(fn)
return $(this.toArray().sort(fn))
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
return $(this.reduce([], function(array, val, key){
if (!fn(val, key))
array.push(val)
return array
}))
},



includes: function() {
var self = this
return $(arguments).all(function(arg){
return self.any(function(val){
return val === arg
})
})
},



first: function(n) {
return n ?
this.slice(0, n) :
this.at(0)
},



last: function(n) {
var len = this.length()
return n ?
this.slice(len - n, len) :
this.at(--len)
},



drop: function(n) {
return this.slice(n, this.length())
},



slice: function(start, end) {
if (this.arr.slice)
return $(this.arr.slice(start, end))
var i = 0
return $(this.reduce([], function(array, val){
if (i++ >= start)
if (i <= end)
array.push(val)
else
throw $break
return array
}))
},



find: function(fn) {
var result, fn = callback(fn)
this.each(function(val, key){
if (fn(val, key)) {
result = val
throw $break
}
})
return result
},



any: function(fn) {
fn = callback(fn)
if (this.arr.some)
return this.arr.some(fn)
return !! this.find(fn)
},



all: function(fn) {
fn = callback(fn)
if (this.arr.every)
return this.arr.every(fn)
return this.reduce(true, function(state, val, key){
if (!state) throw $break
return !! fn(val, key)
})
},



grep: function(pattern) {
return this.select(function(val){
return pattern.exec(val)
})
},



keys: function() {
return $(Object.keys(this.arr))
},



toArray: function() {
return this.reduce([], function(array, val){
val instanceof Collection ?
array.push(val.toArray()) :
array.push(val)
return array

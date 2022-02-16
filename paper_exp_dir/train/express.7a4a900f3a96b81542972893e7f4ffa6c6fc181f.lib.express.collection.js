




$break = '__break__'



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
this.each(function(val, key){
memo = fn(memo, val, key)
})
return memo
},



map: function(fn) {
if (this.arr.map)
return $(this.arr.map(fn))
return $(this.reduce([], function(array, val, key){
array.push(fn(val, key))
return array
}))
},



select: function(fn) {
return $(this.reduce([], function(array, val, key){
if (fn(val, key))
array.push(val)
return array
}))
},



reject: function(fn) {
return $(this.reduce([], function(array, val, key){
if (!fn(val, key))
array.push(val)
return array
}))
},



first: function(n) {
return n ? this.slice(0, n) : this.at(0)
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
var result
this.each(function(val, key){
if (fn(val, key)) {
result = val
throw $break
}
})
return result
},



any: function(fn) {
if (this.arr.some)
return this.arr.some(fn)
return !! this.find(fn)
},



all: function(fn) {
return this.reduce(true, function(state, val, key){
if (!state) throw $break
return !! fn(val, key)
})
},



grep: function(pattern) {
return this.select(function(val){
return pattern.exec(val)

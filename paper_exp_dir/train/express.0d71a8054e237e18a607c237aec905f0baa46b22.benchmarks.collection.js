
require.paths.unshift('lib')
require.paths.unshift('benchmarks')
process.mixin(GLOBAL, require('sys'))
process.mixin(GLOBAL, require('benchmark'))
require('express')

print = puts

range = function(a, b) {
var array = []
while (a++ < b)
array.push(a-1)
return array
}

suite('Collection with [0..10,000]', 100, function(){
array = range(0, 10000)

benchmark('for', function(){
for (var i = 0, len = array.length; i < len; ++i) ;
})

benchmark('for uncached', function(){
for (var i = 0; i < array.length; ++i) ;
})

benchmark('forEach', function(){
array.forEach(function(){})
})

benchmark('#each', function(){
$(array).each(function(){})
})

benchmark('#map', function(){
$(array).map(function(n){ return n += 1 })
})

benchmark('#map shorthand', function(){
$(array).map('a += 1')
})

benchmark('#find', function(){
$(array).find(function(n){ return n > 5000 })
})

benchmark('#select', function(){
$(array).select(function(n){ return n % 2 })
})

benchmark('#first', function(){
$(array).first(5000)
})

benchmark('#slice', function(){

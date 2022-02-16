
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(Profiler)
use(MethodOverride)
use(ContentLength)
set('root', dirname(__filename))
enable('cache views')
})

get('/hello', function(){


require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(Profiler)
use(MethodOverride)
use(ContentLength)
set('root', dirname(__filename))
enable('helpful 404')
enable('show exceptions')
enable('cache views')
})

var messages = [],
path = require('path'),
posix = require('posix')

get('/', function(){
redirect('/chat')
})

get('/chat', function(){

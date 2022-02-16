
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
set('root', dirname(__filename))
enable('cache views')
})

get('/chat', function(){
render('chat.haml.html')
})


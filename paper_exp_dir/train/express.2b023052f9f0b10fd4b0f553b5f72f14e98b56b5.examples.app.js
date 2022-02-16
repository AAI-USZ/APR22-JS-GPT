
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(CommonLogger)
use(MethodOverride)
use(ContentLength)
set('root', dirname(__filename))
enable('helpful 404')
enable('show exceptions')
enable('cache views')
})

var messages = []

get('/', function(){
redirect('/chat')
})

get('/chat', function(){
render('chat.haml.html', {
locals: {
messages: messages
}
})

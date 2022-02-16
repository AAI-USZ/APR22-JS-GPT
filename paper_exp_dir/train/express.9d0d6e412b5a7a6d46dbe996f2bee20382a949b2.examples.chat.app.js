
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
set('root', dirname(__filename))
enable('cache static files')

})

var messages = []

get('/', function(){
this.redirect('/chat')
})

get('/chat', function(){
this.render('chat.haml.html', {
locals: {
messages: messages

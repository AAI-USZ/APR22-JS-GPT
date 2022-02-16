
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(CommonLogger)
use(MethodOverride)
use(ContentLength)
set('root', dirname(__filename))
enable('throw exceptions')
enable('show exceptions')
enable('cache views')
})

var messages = []

get('/chat', function(){
render('chat.haml.html', {
locals: {

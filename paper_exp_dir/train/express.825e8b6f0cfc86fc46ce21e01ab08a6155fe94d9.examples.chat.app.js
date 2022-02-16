
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
title: 'Chat',
messages: messages
}
})
})

post('/chat', function(){
messages
.push(escape(this.param('message'))
.replace(/(http:\/\/[^\s]+)/g, '<a href="$1" target="express-chat">$1</a>')
.replace(/:\)/g, '<img src="http://icons3.iconfinder.netdna-cdn.com/data/icons/ledicons/emoticon_smile.png">'))

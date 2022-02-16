
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
var fiveMinutes = 300000,
oneMinute = 60000
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
use(Cookie)
use(Session, { lifetime: fiveMinutes, reapInterval: oneMinute })
set('root', __dirname)
enable('cache static files')

})

var messages = [],
utils = require('express/utils')

get('/', function(){
this.redirect('/chat')
})

get('/chat', function(){
this.render('chat.haml.html', {
locals: {
title: 'Chat',
messages: messages,
name: this.session.name,
usersOnline: Session.store.length()
}
})
})

post('/chat', function(){
this.session.name = this.param('name')
messages
.push(utils.escape(this.param('name')) + ': ' + utils.escape(this.param('message'))
.replace(/(http:\/\/[^\s]+)/g, '<a href="$1" target="express-chat">$1</a>')

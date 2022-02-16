
require.paths.unshift('lib')
require('express')
require('express/plugins')

var messages = [],
utils = require('express/utils')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(Cookie)
use(Cache, { lifetime: (5).minutes, reapInterval: (1).minute })
use(Session, { lifetime: (15).minutes, reapInterval: (1).minute })
use(Static)
use(Logger)
set('root', __dirname)
})

get('/', function(){
this.pass('/chat')
})

get('/chat', function(){
var self= this;



Session.store.length(function(error, length){
self.render('chat.haml.html', {
locals: {
title: 'Chat',
messages: messages,
name: self.session.name,

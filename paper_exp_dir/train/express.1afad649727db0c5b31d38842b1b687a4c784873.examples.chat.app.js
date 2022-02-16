
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
use(Cache, { lifetime: fiveMinutes, reapInterval: oneMinute })
use(Session, { lifetime: fiveMinutes, reapInterval: oneMinute })
set('root', __dirname)
})

var messages = [],
utils = require('express/utils'),
http = require('express/http')

get('/', function(){
this.redirect('/chat')
})

get('/chat', function(){
this.render('chat.haml.html', {
locals: {


require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
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

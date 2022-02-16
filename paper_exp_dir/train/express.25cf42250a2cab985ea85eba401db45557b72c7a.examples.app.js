
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
set('root', dirname(__filename))

enable('cache view contents')
})

var messages = [],
StaticFile = require('express/static').File

get('/', function(){
this.redirect('/chat')
})


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

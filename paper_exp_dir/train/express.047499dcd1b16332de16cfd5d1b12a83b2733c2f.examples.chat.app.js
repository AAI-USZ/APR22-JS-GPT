
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
use(Cookie)
use(Session, { reapInterval: 10000, expires: 60000 })
set('root', dirname(__filename))
enable('cache static files')

})

var messages = []

get('/', function(){
this.redirect('/chat')
})


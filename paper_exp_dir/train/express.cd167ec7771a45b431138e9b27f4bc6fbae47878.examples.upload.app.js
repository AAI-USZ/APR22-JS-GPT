
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
use(Cookie)
use(Session)
use(Flash)
set('root', __dirname)
})

get('/', function(){
this.redirect('/upload')
})


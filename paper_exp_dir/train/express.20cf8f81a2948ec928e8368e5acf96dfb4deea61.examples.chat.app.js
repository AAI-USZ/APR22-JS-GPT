
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
set('root', dirname(__filename))
enable('cache static files')

})

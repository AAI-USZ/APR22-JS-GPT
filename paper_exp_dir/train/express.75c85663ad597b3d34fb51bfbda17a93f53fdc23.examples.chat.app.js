
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
enable('cache static files')

})

var messages = [],
utils = require('express/utils')


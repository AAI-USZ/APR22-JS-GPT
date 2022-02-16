
require.paths.unshift('lib')
require('express')
require('express/plugins')

var messages = [],
utils = require('express/utils'),
http = require('express/http')

configure(function(){
use(Logger)
use(MethodOverride)
use(ContentLength)
use(Cookie)
use(Cache, { lifetime: (5).minutes, reapInterval: (1).minute })
use(Session, { lifetime: (15).minutes, reapInterval: (1).minute })

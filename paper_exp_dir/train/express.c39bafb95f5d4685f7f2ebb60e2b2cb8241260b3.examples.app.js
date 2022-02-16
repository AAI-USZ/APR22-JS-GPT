
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
use(Redirect)
set('root', dirname(__filename))
enable('cache views')
})

var messages = [],
path = require('path'),
posix = require('posix')

get('/', function(){

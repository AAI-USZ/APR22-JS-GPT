
require.paths.unshift('lib')
require('express')
require('express/plugins')

var kiwi = require('kiwi')

configure(function(){
kiwi.seed('haml')
kiwi.seed('sass')
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
use(Cookie)
use(Session)

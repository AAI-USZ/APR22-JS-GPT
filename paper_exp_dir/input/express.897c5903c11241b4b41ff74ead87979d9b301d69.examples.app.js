
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(CommonLogger)
use(MethodOverride)
use(ContentLength)
set('root', dirname(__filename))

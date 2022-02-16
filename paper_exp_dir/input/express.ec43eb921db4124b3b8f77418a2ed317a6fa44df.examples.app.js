
require.paths.unshift("./lib")
require('express')
require('express/plugins')


use(MethodOverride)
use(ContentLength)
set('views', dirname(__filename) + '/views')

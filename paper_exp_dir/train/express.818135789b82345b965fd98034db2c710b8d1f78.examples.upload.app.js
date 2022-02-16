
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(CommonLogger)
set('root', __dirname)
})

get('/', function(){
this.redirect('/upload')
})

get('/upload', function(){
this.render('upload.haml.html')
})


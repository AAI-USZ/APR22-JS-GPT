
require.paths.unshift('lib')
require('express')
require('express/plugins')

configure(function(){
use(MethodOverride)
use(ContentLength)
use(Cookie)
use(Session)
use(Flash)
use(Logger)
use(Static)
set('root', __dirname)
set('max upload size', (5).megabytes)
})

get('/', function(){
this.redirect('/upload')
})

get('/upload', function(){
this.render('upload.haml.html', {
locals: {

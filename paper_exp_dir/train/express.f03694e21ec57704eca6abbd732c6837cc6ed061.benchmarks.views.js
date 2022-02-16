
require.paths.unshift('lib')
require.paths.unshift('benchmarks')
process.mixin(GLOBAL, require('sys'))
process.mixin(GLOBAL, require('benchmark'))
require('express')

print = puts

engine = {
ejs: require('ejs'),
haml: require('haml'),
sass: require('sass')
}

options = { locals: { article: { title: 'Foo', body: 'bar' }}}

ejs = '                   \n\
<h1><%= article.title %></h1> \n\
<p><%= article.body %></p>    \n\
'

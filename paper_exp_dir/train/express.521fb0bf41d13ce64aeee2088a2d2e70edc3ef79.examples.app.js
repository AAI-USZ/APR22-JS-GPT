
require.paths.unshift("./lib")
require('express')
require('express/plugins')


use(MethodOverride)
use(ContentLength)
set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
render('user.haml.html', {
locals: {
name: param('id') ? 'User ' + param('id') : 'You'
}
})
})

run()

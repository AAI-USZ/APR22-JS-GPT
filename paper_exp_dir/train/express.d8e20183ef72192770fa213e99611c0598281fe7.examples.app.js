
require.paths.unshift("./lib")
require('express')
require('express/plugins')

use(Profiler)
use(MethodOverride)
use(ContentLength)
set('views', dirname(__filename) + '/views')

get('/user/:id?', function() {
render('user.ejs.html', {
locals: {
id: param('id')
}
})
})

run()

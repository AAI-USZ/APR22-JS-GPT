use(require('express/plugins/content-length').ContentLength)
use(require('express/plugins/common-logger').Logger)
set('views', dirname(__filename) + '/views')

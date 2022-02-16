
describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
use(require('express/plugins/session').Session)
use(require('express/plugins/flash').Flash)
Session.store.clear()
end

describe 'Flash'
describe 'flash()'
it 'should push a flash message'
var headers = { headers: { cookie: 'sid=123' }}

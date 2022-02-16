
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
describe 'given a type and msg'
it 'should push a flash message'
var headers = { headers: { cookie: 'sid=123' }}
post('/', function(){ return this.flash('info', 'email sent') })
get('/', function(){ return this.flash('info').join(', ') })
post('/', headers)
post('/', headers)
get('/', headers).body.should.eql 'email sent, email sent'
end
end

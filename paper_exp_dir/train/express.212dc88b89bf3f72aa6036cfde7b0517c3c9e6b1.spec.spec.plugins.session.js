
describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
use(Session = require('express/plugins/session').Session)
Base = require('express/plugins/session').Base
Session.store.clear()
end

describe 'Session'
describe 'when sid cookie is not present'
it 'should set sid cookie'
get('/login', function(){ return '' })
get('/login').headers['set-cookie'].should.match(/^sid=(\w+);/)
end
end

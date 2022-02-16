
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

describe 'when existing sid cookie is present'
it 'should not set sid'
Session.store.commit(new Base(123))
get('/login', function(){ return '' })
get('/login', { headers: { cookie: 'sid=123' }}).headers.should.not.have_property 'set-cookie'
end
end

describe 'when unknown sid cookie is present'
it 'should set new sid'
get('/login', function(){ return '' })
var headers= get('/login', { headers: { cookie: 'sid=123' }}).headers


describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
use(require('express/plugins/session').Session)
end

describe 'Session'
describe 'when sid cookie is not present'
it 'should set sid cookie'
get('/login', function(){ return '' })
get('/login').headers['set-cookie'].should.match(/^sid=(\w+);/)
end
end

describe 'when sid cookie is present'
it 'should not set sid'
get('/login', function(){ return '' })

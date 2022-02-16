
describe 'Express'
before_each
reset()
use(require('express/plugins/redirect').Redirect)
end

describe 'Redirect'
describe 'redirect()'
it 'should set status to 302'
get('/logout', function(){
this.redirect('/')
})
get('/logout').status.should.eql 302
get('/logout').headers['location'].should.eql '/'
end

it 'should allow optional status code'
get('/logout', function(){
this.redirect('/', 303)
})
get('/logout').status.should.eql 303
get('/logout').headers['location'].should.eql '/'
end
end



describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
use(require('express/plugins/session').Session)
end

describe 'Session'
it 'should persist within specs'
post('/login', function(){
this.session.name = 'tj'
return ''
})

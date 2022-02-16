
describe 'Express'
before_each
reset()
use(require('express/plugins/hooks').Hooks)
callbacks.before = []
callbacks.after = []
end

describe 'Hooks'
describe 'before()'
it 'should be called before every request'
GLOBAL.before(function(){
this.response.body = 'foo'
})

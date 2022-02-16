
describe 'Express'
before_each
reset()
hooks = require('express/plugins/hooks')
use(hooks.Hooks)
hooks.callbacks.before = []
hooks.callbacks.after = []
end

describe 'Hooks'
describe 'before()'
it 'should be called before every request'
GLOBAL.before(function(){

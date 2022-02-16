
describe 'Express'
before_each
reset()
use(require('express/plugins/cache').Cache)
cache = require('express/plugins/cache')
end

describe 'Cache'
describe 'Request'
describe '#cache'
it 'should use memory store by default'
get('/item', function(){
return this.cache.toString()
})
get('/item').body.should.eql '[Memory Store]'
end
end
end
end

describe 'cache Store.Memory'
before_each
store = new cache.Store.Memory
end

describe '#toString()'
it 'should return [Memory Store]'
store.toString().should.eql '[Memory Store]'
end
end


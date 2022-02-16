
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

describe 'Store'
describe 'Memory'
before_each
store = new cache.Store.Memory
end

describe '#toString()'
it 'should return [Memory Store]'
store.toString().should.eql '[Memory Store]'
end
end

describe '#set()'
describe 'given a key and value'
it 'should set the cache data'
store.set('foo', 'bar')
store.get('foo').should.eql 'bar'
end

it 'should override existing data'
store.set('foo', 'bar')
store.set('foo', 'baz')
store.get('foo').should.eql 'baz'
end

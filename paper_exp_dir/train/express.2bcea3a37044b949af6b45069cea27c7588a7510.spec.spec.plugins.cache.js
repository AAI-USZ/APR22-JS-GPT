
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

describe '#set()'
describe 'given a key and value'
it 'should set the cache data'
var result
store.set('foo', 'bar', function(){
store.get('foo', function(val){
result = val
})
})
result.should.eql 'bar'
end

it 'should work with regexp special characters'
var result,
result2
store.set('page:/users/1/comments?page=2', 'html', function(){
store.get('page:/users/1/comments?page=2', function(val){
result = val
store.get('page:*', function(vals){
result2 = vals
})
})
})
result.should.eql 'html'

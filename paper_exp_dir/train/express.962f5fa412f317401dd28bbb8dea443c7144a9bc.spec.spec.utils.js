
describe 'Express'
before
utils = require('express/utils')
end

describe 'escape()'
it 'should escape html'
utils.escape('<p>this & that').should.eql '&lt;p&gt;this &amp; that'
end
end

describe 'uid()'
it 'should return a string of random characters'
utils.uid().should.not.eql utils.uid()
utils.uid().length.should.be_greater_than 20
end
end

describe 'mergeParam()'
describe 'with empty params'
it 'should merge the given key and value'
params = {}
utils.mergeParam('user[names][firstName]', 'tj', params)
params.user.names.firstName.should.eql 'tj'
end
end

describe 'with populated params'

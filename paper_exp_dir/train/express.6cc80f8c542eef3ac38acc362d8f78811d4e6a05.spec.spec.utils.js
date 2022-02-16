
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


describe 'Express'
before_each
reset()
end

describe 'param()'
describe 'given no args'
it 'should throw an error'
-{ param() }.should.throw_error TypeError
end
end

describe 'given a non-string as the first argument'
it 'should throw an error'
-{ param(12) }.should.throw_error TypeError

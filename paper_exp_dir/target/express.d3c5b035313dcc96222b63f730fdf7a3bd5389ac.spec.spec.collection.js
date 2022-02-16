
it 'should consider a single word a property on a'
$(['foo', 'foobar']).map('length').toArray().should.eql [3, 6]

describe '#reduce()'
it 'should iterate with memo object'
var sum = $([1,2,3]).reduce(0, function(sum, n){ return sum + n })

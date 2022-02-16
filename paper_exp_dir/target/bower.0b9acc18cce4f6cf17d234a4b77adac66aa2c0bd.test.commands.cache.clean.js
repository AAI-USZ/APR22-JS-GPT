it('correctly reads arguments', function() {
expect(cacheClean.readOptions(['jquery', 'angular']))
.to.eql([['jquery', 'angular'], {}]);

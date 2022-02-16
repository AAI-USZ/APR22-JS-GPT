failingSpec.error = new Error('Boooooo!!!');
it('should handle failure without line', function() {
failingSpec.line = undefined;

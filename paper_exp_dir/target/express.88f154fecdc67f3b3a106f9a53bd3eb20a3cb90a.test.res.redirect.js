res.headers.should.have.property('location', 'http://example.com/post/1/./edit');
describe('with leading ../', function(){
it('should construct path-relative urls', function(done){

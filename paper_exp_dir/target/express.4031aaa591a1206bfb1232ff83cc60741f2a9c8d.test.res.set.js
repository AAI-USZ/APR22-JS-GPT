describe('.set(field, values)', function(){
it('should set multiple response header fields', function(done){
res.set('Set-Cookie', ["type=ninja", "language=javascript"]);

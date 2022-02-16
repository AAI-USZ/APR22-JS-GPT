describe('with leading //', function(){
it('should pass through scheme-relative urls', function(done){
res.redirect('//cuteoverload.com');

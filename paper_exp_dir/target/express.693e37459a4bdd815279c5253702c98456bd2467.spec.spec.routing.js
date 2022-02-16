describe 'with regular expression'
it 'should match'
get(/^\/user\/(\d+)\/(\w+)/, function(id, operation){

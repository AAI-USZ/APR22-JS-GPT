describe 'status()'
it 'should set the response status'
get('/user', function(){ this.status(500) })

describe '.redirect()'
it 'should redirect to the url specified'
get('foo', function(){ redirect('http://google.com') })


describe 'Express'
  before_each
    reset()
  end
  
  describe 'param()'
    it 'should return a route placeholder value'
      get('/user/:id', function(){
        return 'user ' + param('id')
      })
      get('/user/12').body.should.eql 'user 12'
    end
    
    it 'should return several route placeholder values'
      get('/user/:id/:operation', function(){
        return param('operation') + 'ing user ' + param('id') 
      })
      get('/user/12/edit').body.should.eql 'editing user 12'
    end
    
    it 'should allow optional placeholders'
      get('/user/:id?', function(){
        return param('id') ? 'user ' + param('id') : 'users'
      })
      get('/user/12').body.should.eql 'user 12'
      get('/user').body.should.eql 'users'
    end
    
    it 'should allow placeholders as part of a segment'
      get('/report.:format', function(){
        return 'report as ' + param('format')
      })
      get('/report.csv').body.should.eql 'report as csv'
      get('/report.pdf').body.should.eql 'report as pdf'
    end
    
    it 'should allow optional placeholders in middle segments'
      get('/user/:id?/edit', function(){
        return param('id') ? 'editing ' + param('id') : 'editing your account'
      })
      get('/user/12/edit').body.should.eql 'editing 12'
      get('/user/edit').body.should.eql 'editing your account'
    end
  end
end
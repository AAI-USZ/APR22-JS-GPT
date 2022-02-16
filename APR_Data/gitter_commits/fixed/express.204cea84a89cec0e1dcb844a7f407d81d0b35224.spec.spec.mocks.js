
describe 'Express'
  describe 'Mocks'
    before_each
      Express.routes = []
    end
    
    describe 'mockRequest()'
      it 'should return a mock request'
        mockRequest().method.should.eql 'GET'
      end
      
      it 'should merge hash passed'
        mockRequest({ method : 'POST' }).method.should.eql 'POST'
      end
    end
    
    describe 'mockResponse()'
      it 'should return a mock response'
        mockResponse().status.should.eql 200
      end
      
      it 'should merge hash passed'
        mockResponse({ status : 404 }).status.should.eql 404
      end
    end
    
    describe 'get()'
      it 'should get route when available'
        get('users', function(){ 'User list' })
        get('users').body.should.eql 'User list'
        get('other').status.should.eql 404
      end
    end
    
    describe 'post()'
      it 'should post route when available'
        post('users/delete', function(){ 'Users deleted' })
        post('users/delete').body.should.eql 'Users deleted'
        post('other').status.should.eql 404          
      end
    end

    describe 'put()'
      it 'should put route when available'
        put('user/update', function(){ 'Updated' })
        put('user/update').body.should.eql 'Updated'
        put('other').status.should.eql 404          
      end
    end
    
    describe 'del()'
      it 'should delete route when available'
        del('user', function(){ 'Deleted' })
        del('user').body.should.eql 'Deleted'
        del('other').status.should.eql 404          
      end
    end
    
    describe 'options'
      it 'should allow request to be passed'
        post('article', function(){ request.test })
        post('article', { request : { test : '1' }}).body.should.eql '1'
      end

      it 'should override request body'
        post('article', function(){ request.body })
        post('article', { request : { body : 'foo' }}).body.should.eql 'foo'
      end
    end

  end
end
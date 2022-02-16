
describe 'Express'
  describe '.version'
    it 'should be properly formatted'
      Express.version.should.match /\d+\.\d+\.\d+/
    end
  end
  
  describe '.escape()'
    it 'should escape html'
      Express.escape('<>&""').should.eql '&lt;&gt;&amp;&quot;&quot;'
    end
  end
  
  describe '.normalizePath()'
    it 'should strip leading / trailing slashes'
      Express.normalizePath('/foo/bar/').should.eql 'foo/bar'
    end
    
    it 'should strip leading / trailing whitespace'
      Express.normalizePath('  /foo/').should.eql 'foo'
    end
  end
  
  describe '.contentsOf()'
    it 'should return the body of a function as a string'
      Express.contentsOf(function(){ return 'foo' }).should.include 'return', 'foo'
    end
  end
  
  describe '.header()'
    it 'should set / get headers'
      Express.header('Content-Type', 'text/html')
      Express.header('Content-Type').should.eql 'text/html'
    end
  end
  
  describe '.status()'
    after_each
      Express.response.status = 200
    end
    
    it 'should set response status code by number'
      Express.status(404)
      Express.response.status.should.eql 404
    end
    
    it 'should set using the status string map'
      Express.status('Not Found')
      Express.response.status.should.eql 404
    end
    
    it 'should be case insensitive'
      Express.status('forbidden')
      Express.response.status.should.eql 403
    end
  end
  
  describe '.hashToArray()'
    it 'should map hash key / value pairs to an array'
      headers = { 'Content-Type' : 'text/plain' }
      Express.hashToArray(headers).should.eql [['Content-Type', 'text/plain']]
    end
  end
  
  describe '.arrayToHash()'
    it 'should map an assoc array to an object'
      headers = [['Content-Type', 'text/plain']]
      Express.arrayToHash(headers).should.eql { 'Content-Type' : 'text/plain' }
    end
  end
end
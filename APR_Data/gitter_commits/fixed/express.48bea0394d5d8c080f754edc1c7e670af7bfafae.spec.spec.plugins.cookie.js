
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    compileCookie = require('express/plugins/cookie').compileCookie
    parseCookie = require('express/plugins/cookie').parseCookie
  end
  
  describe 'Cookie'
    describe 'compileCookie()'
      it 'should return a cookie string'
        var data = {
          path: '/',
          domain: '.vision-media.ca'
        }
        compileCookie(data).should.eql 'path=/; domain=.vision-media.ca'
      end
      
      it 'should currectly format any Date objects'
        var data = {
          expires: new Date('May 25, 1987 11:13:00'),
          path: '/foo',
          domain: '.vision-media.ca'
        }
        compileCookie(data).should.eql 'expires=Mon, 25-May-1987 11:13:00 GMT; path=/foo; domain=.vision-media.ca'
      end
      
      it 'should convert true to a key without a value'
        var data = {
          path: '/',
          secure: true,
          httpOnly: true
        }
        compileCookie(data).should.eql 'path=/; secure; httpOnly'
      end
    end
  
    describe 'parseCookie()'
      it 'should parse cookie key/value pairs'
        var attrs = 'sid=1232431234234; data=foo'
        parseCookie(attrs).should.eql { sid: '1232431234234', data: 'foo' }
      end
      
      it 'should normalize keys to lowercase'
        var attrs = 'SID=1232431234234; data=foo'
        parseCookie(attrs).should.eql { sid: '1232431234234', data: 'foo' }
      end
      
      it 'should disregard ad-hoc invalid whitespace'
        var attrs = ' SID     =  1232431234234 ;  data =  foo'
        parseCookie(attrs).should.eql { sid: '1232431234234', data: 'foo' }
      end
    end
    
    describe 'on'
      describe 'request'
        it 'should parse the Cookie header'
          get('/user', function(){
            return this.cookie('foo')
          })
          get('/user', { headers: { cookie: 'foo=bar' }}).body.should.eql 'bar'
        end
      end
      
      describe 'response'
        it 'should set the Set-Cookie header'
          get('/user', function(){
            this.cookie('SID', '732423sdfs73243')
            this.cookie('path', '/')
            return ''  
          })
          get('/user').headers['set-cookie'].should.eql 'SID=732423sdfs73243; path=/'
        end
        
        it 'should not set the Set-Cookie header when nothing is available'
          get('/user', function(){ 
            return ''  
          })
          get('/user').headers.should.not.have_property 'set-cookie'
        end
      end
    end
    
    describe 'cookie()'
      it 'should get request cookie values'
        get('/user', function(){
          return this.cookie('foo')
        })
        get('/user', { headers: { cookie: 'foo=bar' }}).body.should.eql 'bar'
      end
    end
      
  end
end
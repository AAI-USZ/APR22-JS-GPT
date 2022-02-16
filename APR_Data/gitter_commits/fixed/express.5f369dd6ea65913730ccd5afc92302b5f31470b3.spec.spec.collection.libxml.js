
process.mixin(require('express/collection'))
process.mixin(require('express/element-collection'))

describe 'Express'
  describe 'ElementCollection'
  
    describe '$("markup string")'
      it 'should return a ElementCollection'
        $('<p>foo</p>').should.be_an_instance_of Collection
        $('<p>foo</p>').should.be_an_instance_of ElementCollection
      end
      
      it 'should wrap with <html><body>.. when not present'
        $('<p>foo</p>').at(0).name().should.eql 'html'
      end
      
      it 'should not wrap with <html><body> when already present'
        $('<html><body></body></html>').at(0).name().should.eql 'html'
      end
    end
    
    describe '#name()'
      it 'should return the first elements name'
        $('<html><body></body></html>').name().should.eql 'html'
      end
    end
    
    describe '#toString()'
      it 'should output [ElementCollection ...]'
        $('<p>foo</p>').toString().should.match(/\[ElementCollection/)
      end
    end
    
  end
end
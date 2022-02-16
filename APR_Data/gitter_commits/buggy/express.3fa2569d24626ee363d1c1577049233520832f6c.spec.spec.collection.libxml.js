
process.mixin(require('express/collection'))
process.mixin(require('express/element-collection'))

describe 'Express'
  describe 'ElementCollection'
  
    describe '$("markup string")'
      it 'should return a ElementCollection'
        $('<p>foo</p>').should.be_an_instance_of Collection
        $('<p>foo</p>').should.be_an_instance_of ElementCollection
      end
    end
    
    describe '#toString()'
      it 'should output [Collection ...] for array'
        $('<p>foo</p>').toString().should.eql '[ElementCollection <p>foo</p>]'
      end
    end
    
  end
end
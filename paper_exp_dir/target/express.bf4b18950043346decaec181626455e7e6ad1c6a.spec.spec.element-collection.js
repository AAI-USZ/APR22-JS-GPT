describe '#search()'
it 'should find children matching the given css selector'
$('<ul><li>foo</li><li>bar</li></ul>').search('ul > li:nth-child(2)').text().should.eql 'bar'

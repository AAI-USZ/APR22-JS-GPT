title: '"Hello" <new world>!'
postLink(['title-with-tag', 'true']).should.eql('<a href="/title-with-tag/" title="&quot;Hello&quot; &lt;new world&gt;!">&quot;Hello&quot; &lt;new world&gt;!</a>');
postLink(['title-with-tag', 'true', '<test>', 'title']).should.eql('<a href="/title-with-tag/" title="&lt;test&gt; title">&lt;test&gt; title</a>');

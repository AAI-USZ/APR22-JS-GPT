img('https://hexo.io/image.jpg').should.eql('<img src="https://hexo.io/image.jpg">');
img('https://hexo.io/image.jpg', {class: 'foo'})
.should.eql('<img src="https://hexo.io/image.jpg" class="foo">');

it('is_current', async() => {
await is.current.call({path: 'index.html', config: hexo.config}).should.eql(true);
await is.current.call({path: 'tags/index.html', config: hexo.config}).should.eql(false);

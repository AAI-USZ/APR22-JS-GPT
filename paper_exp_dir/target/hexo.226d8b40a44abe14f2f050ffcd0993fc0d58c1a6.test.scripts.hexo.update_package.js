it('package.json does not exist', async () => {
await updatePkg(hexo);
hexo.env.init.should.be.false;

const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), { silent: true });
it('custom theme - default theme_dir', () => fs.writeFile(hexo.config_path, 'theme: test')
.then(() => loadConfig(hexo)).then(() => {

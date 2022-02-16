it('process() - handle null ignore', () => {
const box = newBox('test', { ignore: null });
fs.writeFile(pathFn.join(box.base, 'foo.txt'), 'foo')

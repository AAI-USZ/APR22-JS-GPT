await writeFile(join(box.base, 'foo.txt'), 'foo');
await box.process();


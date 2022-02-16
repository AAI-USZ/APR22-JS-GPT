cmd('git', ['checkout', '0.2.2'], { cwd: testPackage })
expect(fs.existsSync(path.join(tempDir, 'baz'))).to.be(true);
expect(fs.existsSync(path.join(tempDir, 'test'))).to.be(false);

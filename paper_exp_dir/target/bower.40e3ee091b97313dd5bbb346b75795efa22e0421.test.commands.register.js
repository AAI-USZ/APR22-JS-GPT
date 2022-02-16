return helpers.run(register, ['some-name', 'some-name/repo'])
name: 'some-name', url: 'git@github.com:some-name/repo.git'
it('should support single-char github names', function () {

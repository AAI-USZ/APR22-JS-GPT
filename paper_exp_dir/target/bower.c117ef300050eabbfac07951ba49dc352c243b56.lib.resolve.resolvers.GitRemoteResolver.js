.then(cmd.bind(cmd, 'git', ['checkout', resolution.commit], { cwd: dir }));

} else {

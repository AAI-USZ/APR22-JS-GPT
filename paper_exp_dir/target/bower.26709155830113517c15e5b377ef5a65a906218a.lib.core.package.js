var resolvedPath = path.resolve(split[0]);
if (isRepo.sync(resolvedPath)) {
this.gitUrl = resolvedPath;

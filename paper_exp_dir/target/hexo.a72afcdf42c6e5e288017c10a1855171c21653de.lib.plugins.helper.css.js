return args.reduce((_result, path, i) => {
if (i) _result += '\n';
if (Array.isArray(path)) {

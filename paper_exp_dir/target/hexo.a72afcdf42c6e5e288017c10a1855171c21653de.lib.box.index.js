if (base && ignore && ignore.length && ignore.some(item => minimatch(base, item))) {
return Promise.resolve('Ignoring dir.');
}

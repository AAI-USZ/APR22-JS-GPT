'use strict';

const { performance, PerformanceObserver } = require('perf_hooks');
const { spawn } = require('child_process');
const { spawn: spawnAsync } = require('hexo-util');
const { rmdir, exists } = require('hexo-fs');
const { resolve } = require('path');
const log = require('hexo-log')();
const { red } = require('chalk');
const hooks = [
{ regex: /Hexo version/, tag: 'hexo-begin' },
{ regex: /Start processing/, tag: 'processing' },
{ regex: /Rendering post/, tag: 'render-post' },
{ regex: /Files loaded/, tag: 'file-loaded' },
{ regex: /generated in/, tag: 'generated' },
{ regex: /Database saved/, tag: 'database-saved' }
];

const isWin32 = require('os').platform() === 'win32';

const npmScript = isWin32 ? 'npm.cmd' : 'npm';

const testDir = resolve('.tmp-hexo-theme-unit-test');
const hexoBin = resolve(testDir, 'node_modules/.bin/hexo');

(async () => {
await init();
log.info('Running benchmark');
await cleanUp();
await run_benchmark('Cold processing');
await run_benchmark('Hot processing');
await cleanUp();
await run_benchmark('Another Cold processing');
await cleanUp();
})();

async function run_benchmark(name) {
return new Promise(resolve => {
const result = {};
const obs = new PerformanceObserver(list => {
const { name, duration: _duration } = list.getEntries()[0];
const duration = _duration / 1000;
result[name] = {
'Cost time (s)': `${duration.toFixed(2)}s`
};
if (duration > 20) {
log.fatal(red('!! Performance regression detected !!'));
}
});
obs.observe({ entryTypes: ['measure'] });

const hexo = spawn('node', [hexoBin, 'g', '--debug'], { cwd: testDir });
hooks.forEach(({ regex, tag }) => {
hexo.stdout.on('data', function listener(data) {
const string = data.toString('utf-8');
if (regex.test(string)) {
performance.mark(tag);
hexo.stdout.removeListener('data', listener);
}
});
});

hexo.on('close', () => {
performance.measure('Load Plugin/Scripts/Database', 'hexo-begin', 'processing');

if (name === 'Hot processing') {
performance.measure('Process Source', 'processing', 'file-loaded');
} else {
performance.measure('Process Source', 'processing', 'render-post');
performance.measure('Render Posts', 'render-post', 'file-loaded');
}

performance.measure('Render Files', 'file-loaded', 'generated');
performance.measure('Save Database', 'generated', 'database-saved');

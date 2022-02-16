'use strict';

const { performance, PerformanceObserver } = require('perf_hooks');
const { spawn } = require('child_process');
const { spawn: spawnAsync } = require('hexo-util');
const { rmdir, exists } = require('hexo-fs');
const { join, resolve } = require('path');
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
const zeroEksDir = process.env.TRAVIS_BUILD_DIR
? join(process.env.TRAVIS_BUILD_DIR, '0x')
: resolve(testDir, '0x');
const hexoBin = resolve(testDir, 'node_modules/.bin/hexo');

const zeroEks = require('0x');

let isProfiling = process.argv.join(' ').includes('--profiling');
let isBenchmark = process.argv.join(' ').includes('--benchmark');

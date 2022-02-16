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
{ regex: /Files loaded/, tag: 'file-loaded' },

'use strict';

const { join } = require('path');
const { exists, mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');

describe('Load database', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'db_test'), {silent: true});
const loadDatabase = require('../../../lib/hexo/load_database');
const dbPath = hexo.database.options.path;

const fixture = {
meta: {
version: 1,
warehouse: require('warehouse').version
},
models: {
Test: [
{_id: 'A'},
{_id: 'B'},
{_id: 'C'}
]
}
};

before(() => mkdirs(hexo.base_dir));

beforeEach(() => {
hexo._dbLoaded = false;
});

after(async () => {
const exist = await exists(dbPath);
if (exist) await unlink(dbPath);
rmdir(hexo.base_dir);
});


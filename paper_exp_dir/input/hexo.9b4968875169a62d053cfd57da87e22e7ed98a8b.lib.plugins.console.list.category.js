'use strict';

const table = require('text-table');

function listCategory() {
const categories = this.model('Category');

const data = categories.sort({name: 1}).map(cate => [cate.name, String(cate.length)]);



'use strict';

function isCurrentHelper(path, strict) {
path = path || '';

if (strict) {
if (path[path.length - 1] === '/') path += 'index.html';

return this.path === path;
}

path = path.replace(/\/index\.html$/, '/');

return this.path.substring(0, path.length) === path;
}

function isHomeHelper() {
return Boolean(this.page.__index);
}

function isPostHelper() {
return Boolean(this.page.__post);
}

function isPageHelper() {
return Boolean(this.page.__page);
}

function isArchiveHelper() {
return Boolean(this.page.archive);
}

function isYearHelper(year) {
var page = this.page;
if (!page.archive) return false;

if (year) {
return page.year === year;
}

return Boolean(page.year);
}

function isMonthHelper(year, month) {
var page = this.page;
if (!page.archive) return false;

if (year) {
if (month) {
return page.year === year && page.month === month;
}

return page.month === year;
}

return Boolean(page.year && page.month);
}

function isCategoryHelper(category) {
if (category) {
return this.page.category === category;
}

return Boolean(this.page.category);
}

function isTagHelper(tag) {
if (tag) {
return this.page.tag === tag;
}

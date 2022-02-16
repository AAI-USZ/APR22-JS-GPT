'use strict';

function pageGenerator(locals) {
return locals.pages.map(page => {
const { path, layout } = page;

if (!layout || layout === 'false' || layout === 'off') {
return {
path,
data: page.content
};
}

const layouts = ['page', 'post', 'index'];

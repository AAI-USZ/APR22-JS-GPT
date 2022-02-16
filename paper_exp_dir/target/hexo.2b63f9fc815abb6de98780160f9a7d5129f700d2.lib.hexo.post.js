loadContent(str) {
if (str.includes('hexoPostRenderEscape')) {
str = str.replace(/<!--hexoPostRenderEscape:/g, '').replace(/:hexoPostRenderEscape-->/g, '');

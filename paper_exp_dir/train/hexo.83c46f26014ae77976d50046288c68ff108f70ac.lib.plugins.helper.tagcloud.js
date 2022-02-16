var _ = require('lodash');


var rHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
rRgb = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(0?\.?\d+)?\s*\)$/,
rHsl = /hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,?\s*(0?\.?\d+)?\s*\)$/;


var colorNames = {
aliceblue: {r: 240, g: 248, b: 255, a: 1},
antiquewhite: {r: 250, g: 235, b: 215, a: 1},
aqua: {r: 0, g: 255, b: 255, a: 1},
aquamarine: {r: 127, g: 255, b: 212, a: 1},
azure: {r: 240, g: 255, b: 255, a: 1},
beige: {r: 245, g: 245, b: 220, a: 1},
bisque: {r: 255, g: 228, b: 196, a: 1},
black: {r: 0, g: 0, b: 0, a: 1},

'use strict';


var rHex3 = /^#([0-9a-f]{3})$/;
var rHex6 = /^#([0-9a-f]{6})$/;
var rRGB = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(0?\.?\d+)?\s*\)$/;
var rHSL = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,?\s*(0?\.?\d+)?\s*\)$/;


var colorNames = {

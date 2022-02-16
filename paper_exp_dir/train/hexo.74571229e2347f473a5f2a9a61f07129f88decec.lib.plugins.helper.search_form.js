'use strict';

function searchFormHelper(options){

options = options || {};

var config = this.config;
var className = options.class || 'search-form';
var text = options.hasOwnProperty('text') ? options.text : 'Search';
var button = options.button;

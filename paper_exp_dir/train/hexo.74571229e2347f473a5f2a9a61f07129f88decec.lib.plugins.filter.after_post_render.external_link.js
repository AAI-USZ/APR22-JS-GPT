'use strict';

var url = require('url');
var cheerio;

function externalLinkFilter(data){

var config = this.config;
if (!config.external_link) return;

if (!cheerio) cheerio = require('cheerio');

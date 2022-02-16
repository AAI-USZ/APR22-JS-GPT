'use strict';

function listTagsHelper(tags, options){

if (!options && (!tags || !tags.hasOwnProperty('length'))){
options = tags;
tags = this.site.tags;
}

if (!tags || !tags.length) return '';
options = options || {};

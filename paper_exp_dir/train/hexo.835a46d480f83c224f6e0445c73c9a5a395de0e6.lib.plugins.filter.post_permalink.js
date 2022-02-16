'use strict';

const defaults = require('lodash/defaults');
const { Permalink, slugize } = require('hexo-util');
const { basename } = require('path');
let permalink;

function postPermalinkFilter(data) {
const { config } = this;
const meta = {
id: data.id || data._id,
title: data.slug,
name: typeof data.slug === 'string' ? basename(data.slug) : '',
post_title: slugize(data.title, {transform: 1}),

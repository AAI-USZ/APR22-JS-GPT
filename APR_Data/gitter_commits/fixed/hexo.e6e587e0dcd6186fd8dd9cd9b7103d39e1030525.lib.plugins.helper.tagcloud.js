'use strict';

const { Color } = require('hexo-util');

function tagcloudHelper(tags, options) {
  if (!options && (!tags || !Object.prototype.hasOwnProperty.call(tags, 'length'))) {
    options = tags;
    tags = this.site.tags;
  }

  if (!tags || !tags.length) return '';
  options = options || {};

  const min = options.min_font || 10;
  const max = options.max_font || 20;
  const orderby = options.orderby || 'name';
  const order = options.order || 1;
  const unit = options.unit || 'px';
  const color = options.color;
  const className = options.class;
  const level = options.level || 10;
  const { transform } = options;
  const separator = options.separator || ' ';
  const result = [];
  let startColor, endColor;

  if (color) {
    if (!options.start_color) throw new TypeError('start_color is required!');
    if (!options.end_color) throw new TypeError('end_color is required!');

    startColor = new Color(options.start_color);
    endColor = new Color(options.end_color);
  }

  // Sort the tags
  if (orderby === 'random' || orderby === 'rand') {
    tags = tags.random();
  } else {
    tags = tags.sort(orderby, order);
  }

  // Limit the number of tags
  if (options.amount) {
    tags = tags.limit(options.amount);
  }

  const sizes = [];

  tags.sort('length').forEach(tag => {
    const { length } = tag;
    if (sizes.includes(length)) return;

    sizes.push(length);
  });

  const length = sizes.length - 1;

  tags.forEach(tag => {
    const ratio = length ? sizes.indexOf(tag.length) / length : 0;
    const size = min + ((max - min) * ratio);
    let style = `font-size: ${parseFloat(size.toFixed(2))}${unit};`;
    const attr = className ? ` class="${className}-${Math.round(ratio * level)}"` : '';

    if (color) {
      const midColor = startColor.mix(endColor, ratio);
      style += ` color: ${midColor.toString()}`;
    }

    result.push(
      `<a href="${this.url_for(tag.path)}" style="${style}"${attr}>${transform ? transform(tag.name) : tag.name}</a>`
    );
  });

  return result.join(separator);
}

module.exports = tagcloudHelper;

'use strict';



function vimeoTag(args, content) {
const id = args[0];

return `<div class="video-container"><iframe src="https://player.vimeo.com/video/${id}" frameborder="0" loading="lazy" allowfullscreen></iframe></div>`;
}

module.exports = vimeoTag;

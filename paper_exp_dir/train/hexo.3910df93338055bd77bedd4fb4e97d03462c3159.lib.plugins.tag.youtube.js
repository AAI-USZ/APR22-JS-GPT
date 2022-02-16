'use strict';



function youtubeTag(id) {
return `<div class="video-container"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0" loading="lazy" allowfullscreen></iframe></div>`;
}

module.exports = youtubeTag;

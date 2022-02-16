

this.getMediaEmbed = function(mediaObject, options)
{
switch(mediaObject.media_type)
{
case 'image':
return '<img class="img-responsive" src="' + mediaObject.location + '" style="^media_style^"></img>';
case 'youtube':
return '<iframe width="560" height="315" src="//www.youtube.com/embed/' + mediaObject.location + '" frameborder="0" allowfullscreen></iframe>';
case 'vimeo':
return '<iframe src="//player.vimeo.com/video/' + mediaObject.location + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
case 'daily_motion':
return '<iframe frameborder="0" width="480" height="270" src="http://www.dailymotion.com/embed/video/' + mediaObject.location + '"></iframe>'
}
}

this.getMediaStyle = function(template, styleString)
{
var styleElements = styleString.split(',');
var containerCSS = [];
var mediaCSS = [];

for(var i = 0; i < styleElements.length; i++)
{
var styleSetting = styleElements[i].split(':');

switch(styleSetting[0])

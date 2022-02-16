var layoutRange;
var selectedHTML;

$(document).ready(function()
{
$('#layout_content').resizable({handles: 'n,s'});
});

function calculateColumnInches()
{
var wordCount = $('#layout_editable').text().split(' ').length;
var columnInches = (Math.floor(wordCount / 4) * 0.1).toFixed(1);

$('#column_inches').html('(' + columnInches + ' ' + loc.generic.COLUMN_INCHES + ')');
}

function toggleLayoutFullscreen()
{
if(!$('#layout_editor').attr('style'))
{
openLayoutFullscreen();
}
else if($('#layout_editor').attr('style').length == 0)
{
openLayoutFullscreen();
}
else
{
closeLayoutFullscreen();
}
}

function openLayoutFullscreen()
{
$('#layout_content').resizable('disable');

$('#layout_editor').css(
{
'background-color': '#FFFFFF',
'position': 'fixed',
'top': '0',
'left': '0',
'width': '100%',
'height': '100%',
'overflow': 'auto',
'z-index': '50000'
});

$('#layout_content').css(
{
'height': ($('#layout_editor').height() - $('#layout_content').position().top) + 'px',
'margin': '0',
'opacity': '1'
});

$('#layout_code').focus();
}

function closeLayoutFullscreen()
{
$('#layout_content').resizable('enable');

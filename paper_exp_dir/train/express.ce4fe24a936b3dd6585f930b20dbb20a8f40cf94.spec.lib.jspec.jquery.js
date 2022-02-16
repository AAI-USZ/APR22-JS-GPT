


JSpec
.requires('jQuery', 'when using jspec.jquery.js')
.include({
name: 'jQuery',



init : function() {
jQuery.ajaxSetup({ async: false })
},



utilities : {
element:  jQuery,
elements: jQuery,
sandbox : function() {
return jQuery('<div class="sandbox"></div>')
}
},



matchers : {
have_tag      : "jQuery(expected, actual).length === 1",
have_one      : "alias have_tag",
have_tags     : "jQuery(expected, actual).length > 1",
have_many     : "alias have_tags",
have_any      : "alias have_tags",
have_child    : "jQuery(actual).children(expected).length === 1",
have_children : "jQuery(actual).children(expected).length > 1",
have_text     : "jQuery(actual).text() === expected",
have_value    : "jQuery(actual).val() === expected",
be_enabled    : "!jQuery(actual).attr('disabled')",
have_class    : "jQuery(actual).hasClass(expected)",

be_visible : function(actual) {

var fs = require('fs');

var BaseBrowser = require('./Base');


var PREFS =
'Opera Preferences version 2.1\n' +
'[User Prefs]\n' +
'Show Default Browser Dialog=0\n' +
'Startup Type=2\n' +
'Home URL=about:blank\n' +
'Show Close All But Active Dialog=0\n' +
'Show Close All Dialog=0\n' +
'Show Crash Log Upload Dialog=0\n' +
'Show Delete Mail Dialog=0\n' +
'Show Download Manager Selection Dialog=0\n' +
'Show Geolocation License Dialog=0\n' +
'Show Mail Error Dialog=0\n' +
'Show New Opera Dialog=0\n' +
'Show Problem Dialog=0\n' +
'Show Progress Dialog=0\n' +
'Show Validation Dialog=0\n' +
'Show Widget Debug Info Dialog=0\n' +
'Show Startup Dialog=0\n' +
'Show E-mail Client=0\n' +
'Show Mail Header Toolbar=0\n' +
'Show Setupdialog On Start=0\n' +
'Ask For Usage Stats Percentage=0\n'
'Enable Usage Statistics=0\n' +
'[Install]\n' +
'Newest Used Version=1.00.0000\n' +
'[State]\n' +
'Accept License=1\n';


var OperaBrowser = function() {
BaseBrowser.apply(this, arguments);






var extname = require('path').extname



exports.types = {
'323'     : 'text/h323',
'3gp'     : 'video/3gpp',
'a'       : 'application/octet-stream',
'acx'     : 'application/internet-property-stream',
'ai'      : 'application/postscript',
'aif'     : 'audio/x-aiff',
'aifc'    : 'audio/x-aiff',
'aiff'    : 'audio/x-aiff',
'asc'     : 'application/pgp-signature',
'asf'     : 'video/x-ms-asf',
'asr'     : 'video/x-ms-asf',
'asm'     : 'text/x-asm',
'asx'     : 'video/x-ms-asf',
'atom'    : 'application/atom+xml',
'au'      : 'audio/basic',
'avi'     : 'video/x-msvideo',
'axs'     : 'application/olescript',
'bas'     : 'text/plain',
'bat'     : 'application/x-msdownload',
'bcpio'   : 'application/x-bcpio',
'bin'     : 'application/octet-stream',
'bmp'     : 'image/bmp',
'bz2'     : 'application/x-bzip2',
'c'       : 'text/x-c',
'cab'     : 'application/vnd.ms-cab-compressed',
'cat'     : 'application/vnd.ms-pkiseccat',
'cc'      : 'text/x-c',
'cdf'     : 'application/x-netcdf',
'cer'     : 'application/x-x509-ca-cert',
'cgm'     : 'image/cgm',
'chm'     : 'application/vnd.ms-htmlhelp',
'class'   : 'application/octet-stream',
'clp'     : 'application/x-msclip',
'cmx'     : 'image/x-cmx',
'cod'     : 'image/cis-cod',
'com'     : 'application/x-msdownload',
'conf'    : 'text/plain',
'cpio'    : 'application/x-cpio',
'cpp'     : 'text/x-c',
'cpt'     : 'application/mac-compactpro',
'crd'     : 'application/x-mscardfile',
'crl'     : 'application/pkix-crl',
'crt'     : 'application/x-x509-ca-cert',
'csh'     : 'application/x-csh',
'css'     : 'text/css',
'csv'     : 'text/csv',
'cxx'     : 'text/x-c',
'dcr'     : 'application/x-director',
'deb'     : 'application/x-debian-package',
'der'     : 'application/x-x509-ca-cert',
'diff'    : 'text/x-diff',
'dir'     : 'application/x-director',
'djv'     : 'image/vnd.djvu',
'djvu'    : 'image/vnd.djvu',
'dll'     : 'application/x-msdownload',
'dmg'     : 'application/octet-stream',
'dms'     : 'application/octet-stream',
'doc'     : 'application/msword',
'dot'     : 'application/msword',
'dtd'     : 'application/xml-dtd',
'dv'      : 'video/x-dv',
'dvi'     : 'application/x-dvi',
'dxr'     : 'application/x-director',
'ear'     : 'application/java-archive',
'eml'     : 'message/rfc822',
'eps'     : 'application/postscript',
'etx'     : 'text/x-setext',
'evy'     : 'application/envoy',
'exe'     : 'application/x-msdownload',
'ez'      : 'application/andrew-inset',
'f'       : 'text/x-fortran',
'f77'     : 'text/x-fortran',
'f90'     : 'text/x-fortran',
'fif'     : 'application/fractals',
'flr'     : 'x-world/x-vrml',
'flv'     : 'video/x-flv',
'for'     : 'text/x-fortran',
'gem'     : 'application/octet-stream',
'gemspec' : 'text/x-script.ruby',
'gif'     : 'image/gif',
'gram'    : 'application/srgs',
'grxml'   : 'application/srgs+xml',
'gtar'    : 'application/x-gtar',
'gz'      : 'application/x-gzip',
'h'       : 'text/x-c',
'hdf'     : 'application/x-hdf',
'hh'      : 'text/x-c',
'hlp'     : 'application/winhlp',
'hqx'     : 'application/mac-binhex40',
'hta'     : 'application/hta',
'htc'     : 'text/x-component',
'htm'     : 'text/html',
'html'    : 'text/html',
'htt'     : 'text/webviewhtml',
'ice'     : 'x-conference/x-cooltalk',
'ico'     : 'image/vnd.microsoft.icon',
'ics'     : 'text/calendar',
'ief'     : 'image/ief',
'ifb'     : 'text/calendar',
'iges'    : 'model/iges',
'igs'     : 'model/iges',
'iii'     : 'application/x-iphone',
'ins'     : 'application/x-internet-signup',
'isp'     : 'application/x-internet-signup',
'iso'     : 'application/octet-stream',
'jar'     : 'application/java-archive',
'java'    : 'text/x-java-source',
'jfif'    : 'image/pipeg',
'jnlp'    : 'application/x-java-jnlp-file',
'jp2'     : 'image/jp2',
'jpe'     : 'image/jpeg',
'jpeg'    : 'image/jpeg',
'jpg'     : 'image/jpeg',
'js'      : 'application/javascript',
'json'    : 'application/json',
'kar'     : 'audio/midi',
'latex'   : 'application/x-latex',
'lha'     : 'application/octet-stream',
'lsf'     : 'video/x-la-asf',
'lsx'     : 'video/x-la-asf',
'lzh'     : 'application/octet-stream',
'log'     : 'text/plain',
'm13'     : 'application/x-msmediaview',
'm14'     : 'application/x-msmediaview',
'm3u'     : 'audio/x-mpegurl',
'm4a'     : 'audio/mp4a-latm',
'm4b'     : 'audio/mp4a-latm',
'm4p'     : 'audio/mp4a-latm',
'm4u'     : 'video/vnd.mpegurl',
'm4v'     : 'video/mp4',
'mac'     : 'image/x-macpaint',
'man'     : 'text/troff',
'mathml'  : 'application/mathml+xml',
'mbox'    : 'application/mbox',
'mdb'     : 'application/x-msaccess',
'mdoc'    : 'text/troff',
'me'      : 'text/troff',
'mesh'    : 'model/mesh',
'mht'     : 'message/rfc822',
'mhtml'   : 'message/rfc822',
'mid'     : 'audio/midi',
'midi'    : 'audio/midi',
'mif'     : 'application/vnd.mif',
'mime'    : 'message/rfc822',
'mml'     : 'application/mathml+xml',
'mng'     : 'video/x-mng',
'mny'     : 'application/x-msmoney',
'mov'     : 'video/quicktime',
'movie'   : 'video/x-sgi-movie',
'mp2'     : 'video/mpeg',
'mp3'     : 'audio/mpeg',
'mp4'     : 'video/mp4',
'mp4v'    : 'video/mp4',
'mpa'     : 'video/mpeg',
'mpe'     : 'video/mpeg',
'mpeg'    : 'video/mpeg',
'mpg'     : 'video/mpeg',
'mpga'    : 'audio/mpeg',
'mpp'     : 'application/vnd.ms-project',
'mpv2'    : 'video/mpeg',
'ms'      : 'text/troff',
'msh'     : 'model/mesh',
'msi'     : 'application/x-msdownload',
'mvb'     : 'application/x-msmediaview',
'mxu'     : 'video/vnd.mpegurl',
'nc'      : 'application/x-netcdf',
'nws'     : 'message/rfc822',
'oda'     : 'application/oda',
'odp'     : 'application/vnd.oasis.opendocument.presentation',
'ods'     : 'application/vnd.oasis.opendocument.spreadsheet',
'odt'     : 'application/vnd.oasis.opendocument.text',
'ogg'     : 'application/ogg',
'p'       : 'text/x-pascal',
'p10'     : 'application/pkcs10',
'p12'     : 'application/x-pkcs12',
'p7b'     : 'application/x-pkcs7-certificates',
'p7c'     : 'application/x-pkcs7-mime',
'p7m'     : 'application/x-pkcs7-mime',
'p7r'     : 'application/x-pkcs7-certreqresp',
'p7s'     : 'application/x-pkcs7-signature',
'pas'     : 'text/x-pascal',
'pbm'     : 'image/x-portable-bitmap',
'pct'     : 'image/pict',
'pdb'     : 'chemical/x-pdb',
'pdf'     : 'application/pdf',
'pem'     : 'application/x-x509-ca-cert',
'pfx'     : 'application/x-pkcs12',
'pgm'     : 'image/x-portable-graymap',
'pgn'     : 'application/x-chess-pgn',
'pgp'     : 'application/pgp-encrypted',
'pic'     : 'image/pict',
'pict'    : 'image/pict',
'pkg'     : 'application/octet-stream',
'pko'     : 'application/ynd.ms-pkipko',
'pl'      : 'text/x-script.perl',
'pm'      : 'text/x-script.perl-module',
'pma'     : 'application/x-perfmon',
'pmc'     : 'application/x-perfmon',
'pml'     : 'application/x-perfmon',
'pmr'     : 'application/x-perfmon',
'pmw'     : 'application/x-perfmon',
'png'     : 'image/png',
'pnm'     : 'image/x-portable-anymap',
'pnt'     : 'image/x-macpaint',
'pntg'    : 'image/x-macpaint',
'pot'     : 'application/vnd.ms-powerpoint',
'ppm'     : 'image/x-portable-pixmap',
'pps'     : 'application/vnd.ms-powerpoint',
'ppt'     : 'application/vnd.ms-powerpoint',
'prf'     : 'application/pics-rules',
'ps'      : 'application/postscript',
'psd'     : 'image/vnd.adobe.photoshop',
'pub'     : 'application/x-mspublisher',
'py'      : 'text/x-script.python',
'qt'      : 'video/quicktime',
'qti'     : 'image/x-quicktime',
'qtif'    : 'image/x-quicktime',
'ra'      : 'audio/x-pn-realaudio',
'rake'    : 'text/x-script.ruby',
'ram'     : 'audio/x-pn-realaudio',
'rar'     : 'application/x-rar-compressed',
'ras'     : 'image/x-cmu-raster',
'rb'      : 'text/x-script.ruby',
'rdf'     : 'application/rdf+xml',
'rgb'     : 'image/x-rgb',
'rm'      : 'application/vnd.rn-realmedia',
'rmi'     : 'audio/mid',
'roff'    : 'text/troff',
'rpm'     : 'application/x-redhat-package-manager',
'rss'     : 'application/rss+xml',
'rtf'     : 'application/rtf',
'rtx'     : 'text/richtext',
'ru'      : 'text/x-script.ruby',
's'       : 'text/x-asm',
'scd'     : 'application/x-msschedule',
'sct'     : 'text/scriptlet',
'setpay'  : 'application/set-payment-initiation',
'setreg'  : 'application/set-registration-initiation',
'sgm'     : 'text/sgml',
'sgml'    : 'text/sgml',
'sh'      : 'application/x-sh',
'shar'    : 'application/x-shar',
'sig'     : 'application/pgp-signature',
'silo'    : 'model/mesh',
'sit'     : 'application/x-stuffit',
'skd'     : 'application/x-koan',
'skm'     : 'application/x-koan',
'skp'     : 'application/x-koan',
'skt'     : 'application/x-koan',
'smi'     : 'application/smil',
'smil'    : 'application/smil',
'snd'     : 'audio/basic',
'so'      : 'application/octet-stream',
'spc'     : 'application/x-pkcs7-certificates',
'spl'     : 'application/x-futuresplash',
'src'     : 'application/x-wais-source',
'sst'     : 'application/vnd.ms-pkicertstore',
'stl'     : 'application/vnd.ms-pkistl',
'stm'     : 'text/html',
'sv4cpio' : 'application/x-sv4cpio',
'sv4crc'  : 'application/x-sv4crc',
'svg'     : 'image/svg+xml',
'svgz'    : 'image/svg+xml',
'swf'     : 'application/x-shockwave-flash',
't'       : 'text/troff',
'tar'     : 'application/x-tar',
'tbz'     : 'application/x-bzip-compressed-tar',
'tcl'     : 'application/x-tcl',
'tex'     : 'application/x-tex',
'texi'    : 'application/x-texinfo',
'texinfo' : 'application/x-texinfo',
'text'    : 'text/plain',
'tgz'     : 'application/x-compressed',
'tif'     : 'image/tiff',
'tiff'    : 'image/tiff',
'torrent' : 'application/x-bittorrent',
'tr'      : 'text/troff',
'trm'     : 'application/x-msterminal',
'tsv'     : 'text/tab-seperated-values',
'txt'     : 'text/plain',
'uls'     : 'text/iuls',
'ustar'   : 'application/x-ustar',
'vcd'     : 'application/x-cdlink',
'vcf'     : 'text/x-vcard',
'vcs'     : 'text/x-vcalendar',
'vrml'    : 'model/vrml',
'vxml'    : 'application/voicexml+xml',
'war'     : 'application/java-archive',
'wav'     : 'audio/x-wav',
'wbmp'    : 'image/vnd.wap.wbmp',
'wbxml'   : 'application/vnd.wap.wbxml',
'wcm'     : 'application/vnd.ms-works',
'wdb'     : 'application/vnd.ms-works',
'wks'     : 'application/vnd.ms-works',
'wma'     : 'audio/x-ms-wma',
'wmf'     : 'application/x-msmetafile',
'wml'     : 'text/vnd.wap.wml',
'wmls'    : 'text/vnd.wap.wmlscript',
'wmlsc'   : 'application/vnd.wap.wmlscriptc',
'wmv'     : 'video/x-ms-wmv',
'wmx'     : 'video/x-ms-wmx',
'wps'     : 'application/vnd.ms-works',
'wri'     : 'application/x-mswrite',
'wrl'     : 'model/vrml',
'wrz'     : 'x-world/x-vrml',
'wsdl'    : 'application/wsdl+xml',
'xaf'     : 'x-world/x-vrml',
'xbm'     : 'image/x-xbitmap',
'xht'     : 'application/xhtml+xml',
'xhtml'   : 'application/xhtml+xml',
'xla'     : 'application/vnd.ms-excel',
'xlc'     : 'application/vnd.ms-excel',
'xlm'     : 'application/vnd.ms-excel',
'xls'     : 'application/vnd.ms-excel',
'xlt'     : 'application/vnd.ms-excel',
'xml'     : 'application/xml',
'xof'     : 'x-world/x-vrml',
'xpm'     : 'image/x-xpixmap',
'xsl'     : 'application/xml',
'xslt'    : 'application/xslt+xml',
'xul'     : 'application/vnd.mozilla.xul+xml',
'xwd'     : 'image/x-xwindowdump',
'xyz'     : 'chemical/x-xyz',
'yaml'    : 'text/yaml',
'yml'     : 'text/yaml',
'z'       : 'application/x-compress',
'zip'     : 'application/zip'
}



exports.type = function(path) {
if (path[0] === '.') path = path.substr(1)
return exports.types[path] ||
exports.types[extname(path).substr(1)] ||
set('default mime type') ||
'application/octet-stream'

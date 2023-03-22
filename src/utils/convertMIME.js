const MIMEList = [
  {
    MIMEF: 'application/envoy',
    extensionName: 'evy'
  }, {
    MIMEF: 'application/fractals',
    extensionName: 'fif'
  }, {
    MIMEF: 'application/futuresplash',
    extensionName: 'spl'
  }, {
    MIMEF: 'application/hta',
    extensionName: 'hta'
  }, {
    MIMEF: 'application/internet-property-stream',
    extensionName: 'acx'
  }, {
    MIMEF: 'application/mac-binhex40',
    extensionName: 'hqx'
  }, {
    MIMEF: 'application/msword',
    extensionName: 'doc'
  }, {
    MIMEF: 'application/msword',
    extensionName: 'dot'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: '*'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'bin'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'evy'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'class'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'dms'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'exe'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'lha'
  }, {
    MIMEF: 'application/octet-stream',
    extensionName: 'lzh'
  }, {
    MIMEF: 'application/oda',
    extensionName: 'oda'
  }, {
    MIMEF: 'application/olescript',
    extensionName: 'axs'
  }, {
    MIMEF: 'application/pdf',
    extensionName: 'pdf'
  }, {
    MIMEF: 'application/pics-rules',
    extensionName: 'prf'
  }, {
    MIMEF: 'application/pkcs10',
    extensionName: 'p10'
  }, {
    MIMEF: "application/pkix-crl", extensionName: 'crl'
  },
  {
    MIMEF: "application/postscript",
    extensionName: "ai"
  },
  {
    MIMEF: "application/postscript",
    extensionName: "eps"
  },
  {
    MIMEF: "application/postscript",
    extensionName: "ps"
  },
  {
    MIMEF: "application/rtf",
    extensionName: "rtf"
  },
  {
    MIMEF: "application/set-payment-initiation",
    extensionName: "setpay"
  },
  {
    MIMEF: "application/set-registration-initiation",
    extensionName: "setreg"
  },
  {
    MIMEF: "application/vnd.ms-excel",
    extensionName: "xla"
  },
  {
    MIMEF: "application/vnd.ms-excel",
    extensionName: "xlc"
  },
  {
    MIMEF: "application/vnd.ms-excel",
    extensionName: "xlm"
  },
  {
    MIMEF: "application/vnd.ms-excel",
    extensionName: "xls"
  },
  {
    MIMEF: "application/vnd.ms-excel",
    extensionName: "xlt"
  },
  {
    MIMEF: "application/vnd.ms-excel",
    extensionName: "xlw"
  },
  {
    MIMEF: "application/vnd.ms-outlook",
    extensionName: "msg"
  },
  {
    MIMEF: "application/vnd.ms-pkicertstore",
    extensionName: "sst"
  },
  {
    MIMEF: "application/vnd.ms-pkiseccat",
    extensionName: "cat"
  },
  {
    MIMEF: "application/vnd.ms-pkistl",
    extensionName: "stl"
  },
  {
    MIMEF: "application/vnd.ms-powerpoint",
    extensionName: "pot"
  },
  {
    MIMEF: "application/vnd.ms-powerpoint",
    extensionName: "pps"
  },
  {
    MIMEF: "application/vnd.ms-powerpoint",
    extensionName: "ppt"
  },
  {
    MIMEF: "application/vnd.ms-project",
    extensionName: "mpp"
  },
  {
    MIMEF: "application/vnd.ms-works",
    extensionName: "wcm"
  },
  {
    MIMEF: "application/vnd.ms-works",
    extensionName: "wdb"
  },
  {
    MIMEF: "application/vnd.ms-works",
    extensionName: "wks"
  },
  {
    MIMEF: "application/vnd.ms-works",
    extensionName: "wps"
  },
  {
    MIMEF: "image/png",
    extensionName: "png"
  },

  {
    MIMEF: "application/winhlp",
    extensionName: "hlp"
  },
  {
    MIMEF: "application/x-bcpio",
    extensionName: "bcpio"
  },
  {
    MIMEF: "application/x-cdf",
    extensionName: "cdf"
  },
  {
    MIMEF: "application/x-compress",
    extensionName: "z"
  },
  {
    MIMEF: "application/x-compressed",
    extensionName: "tgz"
  },
  {
    MIMEF: "application/x-cpio",
    extensionName: "cpio"
  },
  {
    MIMEF: "application/x-csh",
    extensionName: "csh"
  },
  {
    MIMEF: "application/x-director",
    extensionName: "dcr"
  },
  {
    MIMEF: "application/x-director",
    extensionName: "dir"
  },
  {
    MIMEF: "application/x-director",
    extensionName: "dxr"
  },
  {
    MIMEF: "application/x-dvi",
    extensionName: "dvi"
  },
  {
    MIMEF: "application/x-gtar",
    extensionName: "gtar"
  },
  {
    MIMEF: "application/x-gzip",
    extensionName: "gz"
  },
  {
    MIMEF: "application/x-hdf",
    extensionName: "hdf"
  },
  {
    MIMEF: "application/x-internet-signup",
    extensionName: "ins"
  },
  {
    MIMEF: "application/x-internet-signup",
    extensionName: "isp"
  },
  {
    MIMEF: "application/x-iphone",
    extensionName: "iii"
  },
  {
    MIMEF: "application/x-javascript",
    extensionName: "js"
  },
  {
    MIMEF: "application/x-latex",
    extensionName: "latex"
  },
  {
    MIMEF: "application/x-msaccess",
    extensionName: "mdb"
  },
  {
    MIMEF: "application/x-mscardfile",
    extensionName: "crd"
  },
  {
    MIMEF: "application/x-msclip",
    extensionName: "clp"
  },
  {
    MIMEF: "application/x-msdownload",
    extensionName: "dll"
  },
  {
    MIMEF: "application/x-msmediaview",
    extensionName: "m13"
  },
  {
    MIMEF: "application/x-msmediaview",
    extensionName: "m14"
  },
  {
    MIMEF: "application/x-msmediaview",
    extensionName: "mvb"
  },
  {
    MIMEF: "application/x-msmetafile",
    extensionName: "wmf"
  },
  {
    MIMEF: "application/x-msmoney",
    extensionName: "mny"
  },
  {
    MIMEF: "application/x-mspublisher",
    extensionName: "pub"
  },
  {
    MIMEF: "application/x-msschedule",
    extensionName: "scd"
  },
  {
    MIMEF: "application/x-msterminal",
    extensionName: "trm"
  },
  {
    MIMEF: "application/x-mswrite",
    extensionName: "wri"
  },
  {
    MIMEF: "application/x-netcdf",
    extensionName: "cdf"
  },
  {
    MIMEF: "application/x-netcdf",
    extensionName: "nc"
  },
  {
    MIMEF: "application/x-perfmon",
    extensionName: "pma"
  },
  {
    MIMEF: "application/x-perfmon",
    extensionName: "pmc"
  },
  {
    MIMEF: "application/x-perfmon",
    extensionName: "pml"
  },
  {
    MIMEF: "application/x-perfmon",
    extensionName: "pmr"
  },
  {
    MIMEF: "application/x-perfmon",
    extensionName: "pmw"
  },
  {
    MIMEF: "application/x-pkcs12",
    extensionName: "p12"
  },
  {
    MIMEF: "application/x-pkcs12",
    extensionName: "pfx"
  },
  {
    MIMEF: "application/x-pkcs7-certificates",
    extensionName: "p7b"
  },
  {
    MIMEF: "application/x-pkcs7-certificates",
    extensionName: "spc"
  },
  {
    MIMEF: "application/x-pkcs7-certreqresp",
    extensionName: "p7r"
  },
  {
    MIMEF: "application/x-pkcs7-mime",
    extensionName: "p7c"
  },
  {
    MIMEF: "application/x-pkcs7-mime",
    extensionName: "p7m"
  },
  {
    MIMEF: "application/x-pkcs7-signature",
    extensionName: "p7s"
  },
  {
    MIMEF: "application/x-sh",
    extensionName: "sh"
  },
  {
    MIMEF: "application/x-shar",
    extensionName: "shar"
  },
  {
    MIMEF: "application/x-shockwave-flash",
    extensionName: "swf"
  },
  {
    MIMEF: "application/x-stuffit",
    extensionName: "sit"
  },
  {
    MIMEF: "application/x-sv4cpio",
    extensionName: "sv4cpio"
  },
  {
    MIMEF: "application/x-sv4crc",
    extensionName: "sv4crc"
  },
  {
    MIMEF: "application/x-tar",
    extensionName: "tar"
  },
  {
    MIMEF: "application/x-tcl",
    extensionName: "tcl"
  },
  {
    MIMEF: "application/x-tex",
    extensionName: "tex"
  },
  {
    MIMEF: "application/x-texinfo",
    extensionName: "texi"
  },
  {
    MIMEF: "application/x-texinfo",
    extensionName: "texinfo"
  },
  {
    MIMEF: "application/x-troff",
    extensionName: "roff"
  },
  {
    MIMEF: "application/x-troff",
    extensionName: "t"
  },
  {
    MIMEF: "application/x-troff",
    extensionName: "tr"
  },
  {
    MIMEF: "application/x-troff-man",
    extensionName: "man"
  },
  {
    MIMEF: "application/x-troff-me",
    extensionName: "me"
  },
  {
    MIMEF: "application/x-troff-ms",
    extensionName: "ms"
  },
  {
    MIMEF: "application/x-ustar",
    extensionName: "ustar"
  },
  {
    MIMEF: "application/x-wais-source",
    extensionName: "src"
  },
  {
    MIMEF: "application/x-x509-ca-cert",
    extensionName: "cer"
  },
  {
    MIMEF: "application/x-x509-ca-cert",
    extensionName: "crt"
  },
  {
    MIMEF: "application/x-x509-ca-cert",
    extensionName: "der"
  },
  {
    MIMEF: "application/ynd.ms-pkipko",
    extensionName: "pko"
  },
  {
    MIMEF: "application/zip",
    extensionName: "zip"
  },
  {
    MIMEF: "audio/basic",
    extensionName: "au"
  },
  {
    MIMEF: "audio/basic",
    extensionName: "snd"
  },
  {
    MIMEF: "audio/mid",
    extensionName: "mid"
  },
  {
    MIMEF: "audio/mid",
    extensionName: "rmi"
  },
  {
    MIMEF: "audio/mpeg",
    extensionName: "mp3"
  },
  {
    MIMEF: "audio/x-aiff",
    extensionName: "aif"
  },
  {
    MIMEF: "audio/x-aiff",
    extensionName: "aifc"
  },
  {
    MIMEF: "audio/x-aiff",
    extensionName: "aiff"
  },
  {
    MIMEF: "audio/x-mpegurl",
    extensionName: "m3u"
  },
  {
    MIMEF: "audio/x-pn-realaudio",
    extensionName: "ra"
  },
  {
    MIMEF: "audio/x-pn-realaudio",
    extensionName: "ram"
  },
  {
    MIMEF: "audio/x-wav",
    extensionName: "wav"
  },
  {
    MIMEF: "image/bmp",
    extensionName: "bmp"
  },
  {
    MIMEF: "image/cis-cod",
    extensionName: "cod"
  },
  {
    MIMEF: "image/gif",
    extensionName: "gif"
  },
  {
    MIMEF: "image/ief",
    extensionName: "ief"
  },
  {
    MIMEF: "image/jpeg",
    extensionName: "jpe"
  },
  {
    MIMEF: "image/jpeg",
    extensionName: "jpeg"
  },
  {
    MIMEF: "image/jpeg",
    extensionName: "jpg"
  },
  {
    MIMEF: "image/pipeg",
    extensionName: "jfif"
  },
  {
    MIMEF: "image/svg+xml",
    extensionName: "svg"
  },
  {
    MIMEF: "image/tiff",
    extensionName: "tif"
  },
  {
    MIMEF: "image/tiff",
    extensionName: "tiff"
  },
  {
    MIMEF: "image/x-cmu-raster",
    extensionName: "ras"
  },
  {
    MIMEF: "image/x-cmx",
    extensionName: "cmx"
  },
  {
    MIMEF: "image/x-icon",
    extensionName: "ico"
  },
  {
    MIMEF: "image/x-portable-anymap",
    extensionName: "pnm"
  },
  {
    MIMEF: "image/x-portable-bitmap",
    extensionName: "pbm"
  },
  {
    MIMEF: "image/x-portable-graymap",
    extensionName: "pgm"
  },
  {
    MIMEF: "image/x-portable-pixmap",
    extensionName: "ppm"
  },
  {
    MIMEF: "image/x-rgb",
    extensionName: "rgb"
  },
  {
    MIMEF: "image/x-xbitmap",
    extensionName: "xbm"
  },
  {
    MIMEF: "image/x-xpixmap",
    extensionName: "xpm"
  },
  {
    MIMEF: "image/x-xwindowdump",
    extensionName: "xwd"
  },
  {
    MIMEF: "message/rfc822",
    extensionName: "mht"
  },
  {
    MIMEF: "message/rfc822",
    extensionName: "mhtml"
  },
  {
    MIMEF: "message/rfc822",
    extensionName: "nws"
  },
  {
    MIMEF: "text/css",
    extensionName: "css"
  },
  {
    MIMEF: "text/h323",
    extensionName: "323"
  },
  {
    MIMEF: "text/html",
    extensionName: "htm"
  },
  {
    MIMEF: "text/html",
    extensionName: "html"
  },
  {
    MIMEF: "text/html",
    extensionName: "stm"
  },
  {
    MIMEF: "text/iuls",
    extensionName: "uls"
  },
  {
    MIMEF: "text/plain",
    extensionName: "bas"
  },
  {
    MIMEF: "text/plain",
    extensionName: "c"
  },
  {
    MIMEF: "text/plain",
    extensionName: "h"
  },
  {
    MIMEF: "text/plain",
    extensionName: "txt"
  },
  {
    MIMEF: "text/richtext",
    extensionName: "rtx"
  },
  {
    MIMEF: "text/scriptlet",
    extensionName: "sct"
  },
  {
    MIMEF: "text/tab-separated-values",
    extensionName: "tsv"
  },
  {
    MIMEF: "text/webviewhtml",
    extensionName: "htt"
  },
  {
    MIMEF: "text/x-component",
    extensionName: "htc"
  },
  {
    MIMEF: "text/x-setext",
    extensionName: "etx"
  },
  {
    MIMEF: "text/x-vcard",
    extensionName: "vcf"
  },
  {
    MIMEF: "video/mpeg",
    extensionName: "mp2"
  },
  {
    MIMEF: "video/mpeg",
    extensionName: "mpa"
  },
  {
    MIMEF: "video/mpeg",
    extensionName: "mpe"
  },
  {
    MIMEF: "video/mpeg",
    extensionName: "mpeg"
  },
  {
    MIMEF: "video/mpeg",
    extensionName: "mpg"
  },
  {
    MIMEF: "video/mpeg",
    extensionName: "mpv2"
  },
  {
    MIMEF: "video/quicktime",
    extensionName: "mov"
  },
  {
    MIMEF: "video/quicktime",
    extensionName: "qt"
  },
  {
    MIMEF: "video/x-la-asf",
    extensionName: "lsf"
  },
  {
    MIMEF: "video/x-la-asf",
    extensionName: "lsx"
  },
  {
    MIMEF: "video/x-ms-asf",
    extensionName: "asf"
  },
  {
    MIMEF: "video/x-ms-asf",
    extensionName: "asr"
  },
  {
    MIMEF: "video/x-ms-asf",
    extensionName: "asx"
  },
  {
    MIMEF: "video/x-msvideo",
    extensionName: "avi"
  },
  {
    MIMEF: "video/x-sgi-movie",
    extensionName: "movie"
  },
  {
    MIMEF: "x-world/x-vrml",
    extensionName: "flr"
  },
  {
    MIMEF: "x-world/x-vrml",
    extensionName: "vrml"
  },
  {
    MIMEF: "x-world/x-vrml",
    extensionName: "wrl"
  },
  {
    MIMEF: "x-world/x-vrml",
    extensionName: "wrz"
  },
  {
    MIMEF: "x-world/x-vrml",
    extensionName: "xaf"
  },
  {
    MIMEF: "x-world/x-vrml",
    extensionName: "xof"
  }
]

export function MIMEFormat(type) {
  let filterList = MIMEList.filter(item => {
    if (type.includes(item.extensionName)) {
      return item
    }
  }).map((item) => item.MIMEF)
  return filterList
}
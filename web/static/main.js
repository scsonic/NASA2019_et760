console.log("init main.js") ;

var API_URL = "https://firms.modaps.eosdis.nasa.gov/" ;
var API_KEY = "" ;
var PROXY_URL = "https://scsonic.com:5000/" ;

function recentWarning(callback) {
    $.ajax(PROXY_URL, function() {
        callback() ;
    }) ;
}

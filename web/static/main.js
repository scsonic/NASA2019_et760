console.log("init main.js") ;

var API_URL = "https://firms.modaps.eosdis.nasa.gov/" ;
var API_KEY = "" ;
var PROXY_URL = "https://scsonic.com:5000/" ;
var firms_csv = "fire_archive_V1_82135.csv" ;

function recentWarning(callback) {
    $.ajax(PROXY_URL, function() {
        callback() ;
    }) ;
}

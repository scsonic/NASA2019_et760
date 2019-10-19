var express = require('express');
var app = express();
 
//setting middleware
app.use(express.static('./static')); //Serves resources from public folder
 
console.log("start app now~~") ;
var server = app.listen(8080);



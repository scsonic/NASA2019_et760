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

function initPatrol() {
    console.log("initPatrol !!") ;
    var patrolCount = 6 ;

    for ( var d = 0 ; d < patrolCount ; d = d + 1) {
        var usingIcon = 'img/fire32.png' 

        var drone = new google.maps.Marker({
            position: new google.maps.LatLng(gLat+getRndTiny(5), gLon+getRndTiny(5) ),
            map: map,
            icon: usingIcon
        });
        drone.posX = gLat+getRndTiny(30) ;
        drone.posY = gLon+getRndTiny(30) ;


        var dis = 0.005 ;
        var d2 = dis / 2 ;
        drone.pList = [] ;
        drone.pList.push( [gLat - d2  , gLon + dis  ] ) ;
        drone.pList.push( [gLat - dis , gLon + 0    ] ) ;
        drone.pList.push( [gLat - d2  , gLon - dis  ] ) ;
        drone.pList.push( [gLat + d2  , gLon - dis  ] ) ;
        drone.pList.push( [gLat + dis , gLon + 0    ] ) ;
        drone.pList.push( [gLat + d2  , gLon + dis  ] ) ;

        drone._id = "p" + d ;
        drone._numDeltas = 20
        drone._delay = 20 + getIntRnd(10); //milliseconds
        drone._cnt = 0 ;
        drone._deltaLat = 0.0 ;
        drone._deltaLng = 0.0 ;

        drone._dir = 1 ;
        drone._startX = drone.pList[ drone._dir ][0] ;
        drone._startY = drone.pList[ drone._dir ][1] ;

        var nextDir = (drone._dir + 1) % drone.pList.length
        drone._endX = drone.pList[ drone._dir ][0] ;
        drone._endY = drone.pList[ drone._dir ][1] ;

        drone.transitionV3 = function(drone, result){
            drone._cnt = 0;
            //drone.posX = result[0] ;
            //drone.posY = result[1] ;
            drone._deltaLat = (result[0] - drone.posX)/drone._numDeltas;
            drone._deltaLng = (result[1] - drone.posY)/drone._numDeltas;
            drone.moveMarkerV3(drone);
        }

        drone.moveMarkerV3 = function(drone){
            drone.posX += drone._deltaLat;
            drone.posY += drone._deltaLng;

            var latlng = new google.maps.LatLng(drone.posX, drone.posY);
            drone.setPosition(latlng);

            //console.log( drone._id + " cnt=" +  drone._cnt)
            if(drone._cnt != drone._numDeltas){
                drone._cnt++ ;
                setTimeout(function(){
                    drone.moveMarkerV3(drone) ;
                }, drone._delay);
            }
            else {
                //console.log("change dir!! cnt=" + drone._cnt + "," + drone.posX + "/" + drone.posY) ;
                drone._cnt = 0 ;
                drone._deltaLat = 0.0 ;
                drone._deltaLng = 0.0 ;
                console.log("p-drone " + drone._id + " dir=" + drone._dir) ;
                drone.posX = drone.pList[drone._dir][0] ;
                drone.posY = drone.pList[drone._dir][1] ;
                drone._dir = (drone._dir + 1) % drone.pList.length ;
                drone._startX = drone.pList[drone._dir][0] ;
                drone._startY = drone.pList[drone._dir][1] ;
                drone.transitionV3(drone, [drone._startX, drone._startY]) ;    
                drone.setIcon('https://scsonic.github.io/NASA2019_et760/web/static/img/fire32.png') ;
            }
        }
        drone.transitionV3( drone, drone.pList[ drone._dir ] )

        console.log("push one p-drone") ;
        // droneList.push(drone) ;

        // droneList[ droneList.length -1 ].addListener('click',function(target){
        //     console.log(target) ;
        //     console.log("get done id=" + target ) ;
        // });
    }
}

var map;
var polylines = [];

function initMap() {
    console.log('init called');
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
      center: {lat: 48.428611, lng: -123.365556},
      zoom: 14
    });

    google.maps.event.addListener(map, 'click', function(event) {
        var geocoder = new google.maps.Geocoder();
        latlngobj = event.latlng;
        var latlng = {lat: parseFloat(latlngobj.lat()), lng: parseFloat(latlngobj.lng())};
        geocoder.geocode({'location': latlng}, function(event, result){
            console.log(event);
            console.log(result);
        });
    });

}

function mapRoute(routes) {
    console.log('mapRoute called');
    console.log(routes);

    for(var j = 0; j < routes.length; j++){
        latlngPoints = [];
        for(var i = 0; i < routes[j][2].length; i++) {
            latlngPoints.push({lat: routes[j][2][i][0], lng: routes[j][2][i][1]});
        }
        console.log(latlngPoints);
        var strokeColor = '#FF0000';
        var strokeWeight = 3;
        if(j >= 1){
            strokeColor = '#0000FF';
            strokeWeight = 1.5;
        }

        var polyline = new google.maps.Polyline({
            path: latlngPoints,
            geodesic: true,
            strokeColor: strokeColor,
            strokeOpacity: 0.5,
            strokeWeight: strokeWeight
        });

        polyline.setMap(map);
        polylines.push(polyline);
    }

    $("#info-text").text("Best route found with " + routes[0][0] + " street lights");
    $("#info").show();
}

function getRoutes(starting_point, ending_point) {
    console.log(starting_point);
    $("#error").hide();
    $("#info").hide();
    $("#spinner").show();
    $.ajax({
      url: '/route',
      type: 'POST',
      data: { start: starting_point, end:ending_point},
      success: function(data) {
          routes = JSON.parse(data);
          console.log(routes);
          mapRoute(routes);
      },
      error: function() {
          $("#error").show();
      }
  }).always(function() {
        $("#spinner").hide();
    });
}

$("#bttn").click(function() {
    starting_point = $("#starting_point").val();
    ending_point = $("#ending_point").val();
    // Remove current path
    if(!!polylines) {
        for(var i = 0; i < polylines.length; i++) {
            polylines[i].setMap(null);
        }
    }

    routes = getRoutes(starting_point, ending_point);
});

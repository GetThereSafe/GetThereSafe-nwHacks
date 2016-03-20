var map;
var polylines = [];

function initMap() {
    // Get map div element
    var mapDiv = $('#map')[0];
    map = new google.maps.Map(mapDiv, {
      center: {lat: 48.428611, lng: -123.365556},
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    google.maps.event.addListener(map, 'click', function(event) {
        var geocoder = new google.maps.Geocoder();
        console.log(event);
        latlngobj = event.latLng;
        var latlng = {lat: parseFloat(latlngobj.lat()), lng: parseFloat(latlngobj.lng())};
        geocoder.geocode({'location': latlng}, function(event, result){
            if(!!event){
                var address = event[0].formatted_address;
                $("#mapLoc").text(address);
            }
        });
    });
}

function mapRoute(routes) {
    for(var j = 0; j < routes.length; j++){
        latlngPoints = [];
        for(var i = 0; i < routes[j][2].length; i++) {
            latlngPoints.push({lat: routes[j][2][i][0], lng: routes[j][2][i][1]});
        }
        var strokeColor = '#00CC00';
        var strokeWeight = 5;
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
    $("#error").hide();
    $("#info").hide();
    $("#spinner").show();
    $.ajax({
      url: '/route',
      type: 'POST',
      data: { start: starting_point, end: ending_point},
    }).done(function(data) {
      routes = JSON.parse(data);
      mapRoute(routes);
    }).fail(function() {
      $("#error").show();
    }).always(function() {
        $("#mapLoc").text("");
        $("#spinner").hide();
    });
}

$("#bttn").click(function() {
    starting_point = $("#starting_point").val();
    ending_point = $("#ending_point").val();
    // Remove current path
    for(var i = 0; i < polylines.length; i++) {
        polylines[i].setMap(null);
    }

    routes = getRoutes(starting_point, ending_point);
});

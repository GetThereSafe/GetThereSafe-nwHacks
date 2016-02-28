var map;

function initMap() {
    console.log('init called');
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
      center: {lat: 48.428611, lng: -123.365556},
      zoom: 14
    });
}

function mapRoute(route) {
    console.log('mapRoute called');
    console.log(route);

    latlngPoints = [];
    for(var i = 0; i < route.length; i++) {
        latlngPoints.push({lat: route[i][0], lng: route[i][1]});
    }
    console.log(latlngPoints);
    var polyline = new google.maps.Polyline({
        path: latlngPoints,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyline.setMap(map);
}

function getRoutes(starting_point, ending_point) {
    console.log(starting_point);
    $.ajax({
      url: '/route',
      type: 'POST',
      data: { start: starting_point, end:ending_point},
      success: function(data) {
          route = JSON.parse(data);
          console.log(route);
          mapRoute(route);
      }
    });
}

$("#bttn").click(function() {
    starting_point = $("#starting_point").val();
    ending_point = $("#ending_point").val();
    routes = getRoutes(starting_point, ending_point);
});

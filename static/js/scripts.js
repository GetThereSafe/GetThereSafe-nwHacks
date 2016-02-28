function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: 48.428611, lng: -123.365556},
      zoom: 14
    });
}

function getRoutes(starting_point, ending_point) {
    $.post( "/route", {
        start: starting_point,
        end: ending_point
    }, function(data) {
        alert(data);
    });
}

$("#bttn").click(function() {
    starting_point = $("#starting_point").val();
    ending_point = $("#ending_point").val();
    routes = getRoutes(starting_point, ending_point);
});

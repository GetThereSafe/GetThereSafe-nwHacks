function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: 48.428611, lng: -123.365556},
      zoom: 14
    });
}

var getRoutes = function() {
    $.post( "/route", function(data) {
        alert(data);
    });
};

$("#bttn").click(getRoutes);

$("#bttn").click(function() {
    alert("hey");
});

function initMap() {
    console.log('bla');
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: 44.540, lng: -78.546},
      zoom: 8
    });
}

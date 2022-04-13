var map = L.map('map').setView([51.030, -114.035], 11);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    subdomains: ['mt0','mt1','mt2','mt3'],
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidmVnZXRhYmxlaHVudGVyIiwiYSI6ImNrenB1cTM4bzBkcHQybnJ4cDFwOHUzNnQifQ.XB2HogVSioH_O6t03oTGwA'
}).addTo(map);
var markergroup = L.layerGroup().addTo(map);
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var polyLayers = [];
L.drawLocal.draw.toolbar.buttons.polygon = 'Create Polyline'; //NOTE THIS...
var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polyline: true,
        circle: false,
        marker: false,
        polygon: false,
        rectangle: false,
    },
    edit: {
        featureGroup: drawnItems,
        remove: true
    }
});
map.addControl(drawControl);
map.on('draw:created', function (e) {
    var type = e.layerType,
    layer = e.layer;
    drawnItems.addLayer(layer);
});
map.on('draw:edited', function (e) {
    var layers = e.layers;
    var countOfEditedLayers = 0;
    layers.eachLayer(function(layer) {
        countOfEditedLayers++;
    });
});
drawnItems.on("click", function(e) {
    var id = e.layer._leaflet_id;
    geojson = e.layer.toGeoJSON();
    var options = {tolerance: 0.01, highQuality: false};
    var simplified = turf.simplify(geojson, options);
    if (document.getElementById(id) == null) {
        info = e.layer.bindPopup(
            $('<button>Simplify This Polyline</button>').click(function() {
                info = e.layer.bindPopup("Layer Has Been Simplified");
                var geojsonlayer = L.geoJSON(simplified);
                geojsonlayer.eachLayer(
                    function(l) {
                        drawnItems.addLayer(l);
                    }
                );
                //L.geoJSON(simplified).addTo(map);
            }
        )[0]);
    } else {
        info = e.layer.bindPopup("Layer Has Been Simplified");
    }
});
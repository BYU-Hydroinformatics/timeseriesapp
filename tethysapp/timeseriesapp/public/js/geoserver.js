
var reachid2 = 9000286;

// PART 1: USE OF THIRD PARTY LIBRARIES (LEAFLET)

//--A) CREATE AND CENTER THE MAP IN PERU, ADD A WMS LAYER
var map = L.map('map').setView([0, 0], 3);
L.esri.basemapLayer('DarkGray').addTo(map);



var WMSLayer;
var layerGroup;
var url = endpointGeoServer
console.log(endpointGeoServer);
console.log(geoServerWorkspace);
WMSLayer = L.tileLayer.betterWms(url, {
    layers: geoServerWorkspace,
    format:'image/png',
    transparent: true
}).addTo(map);

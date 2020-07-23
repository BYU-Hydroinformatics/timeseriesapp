// var map = L.map('map').setView([4.5709, -74.2973], 6);
//
//  L.esri.basemapLayer('Topographic').addTo(map);
var caseToAddGeolocalizacion;
var reachid = 9000286;
// GEOGLOWS.forecast.graph_stats(reachid,"graphs","Time Series",true,700);
GEOGLOWS.historical.graph(reachid,"graphs","Time Series",true,700);

 var MyCustomMarker = L.Icon.extend({
   options: {
     shadowUrl: null,
     iconAnchor: new L.Point(12, 12),
     iconSize: new L.Point(24, 24),
     iconUrl: 'https://img.icons8.com/fluent/48/000000/rain-gauge.png'
   }
 });
 var center = [4.5709, -74.2973];
 var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
         map2 = new L.Map('map', { center: center, zoom: 13 }),
         drawnItems = L.featureGroup().addTo(map2);
 L.control.layers({
     'Vista Normal': osm.addTo(map2),
     "Vista Satelital": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
         attribution: 'google'
     }),
 }, { 'Casos Anadido': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map2);
 map2.addControl(new L.Control.Draw({
     edit: {
         featureGroup: drawnItems,
         poly: {
             allowIntersection: false
         }
     },
     draw: {
         polyline:true,
         polygon: true,
         circle:true,
         rectangle:true,
         circlemarker:true,
         marker: {
           icon: new MyCustomMarker()
         }
     }
 }));

 map2.on(L.Draw.Event.CREATED, function (event) {
     var layer = event.layer;
     drawnItems.addLayer(layer);
     L.Draw.Event.STOP;
     console.log(layer);
     layer.on('click', function(e){
       console.log("hola");
       // GEOGLOWS.forecast.graph_stats(reachid,"graphs","Time Series",true,700);
       GEOGLOWS.historical.graph(reachid,"ghs","Time Series",true,1500);

     })
     // if(layer['_latlng']){
     //   caseToAddGeolocalizacion=`${layer['_latlng']['lat']},${layer['_latlng']['lng']}`
     // }
     // else{
     //   caseToAddGeolocalizacion = getCentroid(layer['_latlngs']);
     // }
     // layer.bindPopup(function(){
     //   console.log("hola");
     //   GEOGLOWS.forecast.graph_stats(reachid,"graphs",undefined,true,700);
     //
     // })
     // caseToAddGeolocalizacion=`${layer['_latlng']['lat']},${layer['_latlng']['lng']}`
     console.log(caseToAddGeolocalizacion);
 });
 var getCentroid = function (arr) {
     return arr.reduce(function (x,y) {
         return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length]
     }, [0,0])
 }

 var getCentroid2 = function (arr) {
     var twoTimesSignedArea = 0;
     var cxTimes6SignedArea = 0;
     var cyTimes6SignedArea = 0;

     var length = arr.length

     var x = function (i) { return arr[i % length][0] };
     var y = function (i) { return arr[i % length][1] };

     for ( var i = 0; i < arr.length; i++) {
         var twoSA = x(i)*y(i+1) - x(i+1)*y(i);
         twoTimesSignedArea += twoSA;
         cxTimes6SignedArea += (x(i) + x(i+1)) * twoSA;
         cyTimes6SignedArea += (y(i) + y(i+1)) * twoSA;
     }
     var sixSignedArea = 3 * twoTimesSignedArea;
     return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
 }

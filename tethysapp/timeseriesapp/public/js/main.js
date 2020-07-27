
var caseToAddGeolocalizacion;
var reachid = 9000286;


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
 }, { 'Drawing options': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map2);
 map2.addControl(new L.Control.Draw({
     edit: {
         featureGroup: drawnItems,
         poly: {
             allowIntersection: false
         },
         remove: false

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

 //Custom control to delete all points //
 L.Control.RemoveAll = L.Control.extend({
        options: {
            position: 'topleft',
        },

        onAdd: function (map) {
            var controlDiv = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
            var controlUI = L.DomUtil.create('a', 'leaflet-draw-edit-remove', controlDiv);
            controlUI.title = 'Remove all drawn items';
            controlUI.setAttribute('href', '#');

            L.DomEvent
                .addListener(controlUI, 'click', L.DomEvent.stopPropagation)
                .addListener(controlUI, 'click', L.DomEvent.preventDefault)
                .addListener(controlUI, 'click', function () {
                    drawnItems.clearLayers();
                    $("#ghs").empty();
                    $("#ghs").html(`<div id="addSoapIdCentering">
                          <h2>Oops, you need to select a feature ..</h2>
                          <img src="/static/timeseriesapp/images/nodata.png" alt="">
                        </div>`)
                    if(window.console) window.console.log('Drawings deleted...');
                });
            return controlDiv;
        }
    });

removeAllControl = new L.Control.RemoveAll();
map2.addControl(removeAllControl);

 map2.on(L.Draw.Event.CREATED, function (event) {
     var layer = event.layer;
     drawnItems.addLayer(layer);
     L.Draw.Event.STOP;
     console.log(layer);
     layer.on('click', function(e){
       // GEOGLOWS.forecast.graph_stats(reachid,"graphs","Time Series",true,700);
       // GEOGLOWS.forecast.graph_emsembles(reachid,"ghs",undefined,"Time Series",2000);
       // GEOGLOWS.forecast.graph_fr(reachid,"ghs","Time Series",false,1200);
       $("#ghs").empty();
       // GEOGLOWS.forecast.graph_fr(reachid,"ghs","Time Series",false,1200);

       // GEOGLOWS.historical.graph(reachid,"ghs","Time Series",true,1200,350);
       console.log($("#changeTS")['0'].value);
       if($("#changeTS")['0'].value =="Forecast 1"){
         GEOGLOWS.forecast.graph_emsembles(reachid,"ghs",[15,2,52],"Time Series",1200);
       }
       if($("#changeTS")['0'].value =="Historical 1"){
         GEOGLOWS.historical.graph(reachid,"ghs","Time Series",true,1200,350);

       }
       if($("#changeTS")['0'].value == "Seasonal 1"){
         GEOGLOWS.seasonal.graph(reachid,"ghs","Time Series",true,1200,350);

       }
     })

     console.log(caseToAddGeolocalizacion);
 });
 // Adding a event to the select box//
 var changeTimeseries = function(){
   console.log($("#changeTS")['0'].value);
   if($("#changeTS")['0'].value =="Forecast 1"){
     GEOGLOWS.forecast.graph_emsembles(reachid,"ghs",[15,2,52],"Time Series",1200);
   }
   if($("#changeTS")['0'].value =="Historical 1"){
     GEOGLOWS.historical.graph(reachid,"ghs","Time Series",true,1200,350);

   }
   if($("#changeTS")['0'].value == "Seasonal 1"){
     GEOGLOWS.historical.graph(reachid,"ghs","Time Series",true,1200,350);

   }
 }
 $("#changeTS").change(changeTimeseries)

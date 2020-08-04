
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

//--A) ADD THE ABILITY TO ADD A MODAL WITH FORECAST, HISTORICAL, SEASONAL DATA WITH A CLICK
// USE OF CLICK EVENTS //
var marker = null;
map.on("click", function (event) {
  $("#loadingimg").show();
  console.log(event);
    meta = WMSLayer.GetFeatureInfo(event);
    if(meta[0] !==null){
      if (marker) {
        map.removeLayer(marker)
      }
      console.log("this is meta");
      reachid = meta[0];
      console.log(reachid);
      // drain_area = meta[1];
      // region = meta[2];
      marker = L.marker(event.latlng).addTo(map);
      $("#ghs").empty();

      GEOGLOWS.forecast.graph_emsembles(reachid,"ghs",[15,2,52],"Time Series",1200);
      $("#loadingimg").hide();

    }

});

// Add an event for tbe button to change the geoserver endpoint //
var changeGeoserver = function(){
  var endpoint_geo = $("#geoserverEndpoint").val();
  var workspace_geo = $("#geoServerWorkspace").val();
  map.removeLayer(WMSLayer);
  url= endpoint_geo;
    WMSLayer = L.tileLayer.betterWms(url, {
        layers: workspace_geo,
        format:'image/png',
        transparent: true
    }).addTo(map);
    $("#ghs").empty();
    $("#ghs").html(`<div id="addSoapIdCentering">
          <h2>Oops, you need to select a feature ..</h2>
          <img src="/static/timeseriesapp/images/nodata.png" alt="">
        </div>`);
    var marker = null;

    map.on("click", function (event) {
      $("#loadingimg").show();

      console.log(event);
        meta = WMSLayer.GetFeatureInfo(event);
        if(meta[0] !==null){
          if (marker) {
            map.removeLayer(marker)
          }
          console.log("this is meta");
          reachid = meta[0];
          console.log(reachid);
          // drain_area = meta[1];
          // region = meta[2];
          marker = L.marker(event.latlng).addTo(map);
          $("#ghs").empty();

          GEOGLOWS.forecast.graph_emsembles(reachid,"ghs",[15,2,52],"Time Series",1200);
          $("#loadingimg").hide();

          // GEOGLOWS.historical.graph(reachid,"ghs","Time Series",true,1200,350);
          // GEOGLOWS.seasonal.graph(reachid,"ghs","Time Series",true,1200,350);
        }
    });
}

$("#submitGeoserver").on("click",changeGeoserver)

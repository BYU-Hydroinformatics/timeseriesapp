// INIT MAP OF THE CSV PAGE //

var center = [4.5709, -74.2973];
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
var map2 = new L.Map('map', { center: center, zoom: 5 });
osm.addTo(map2);

/*
****** FUNCTION NAME: addDefaultBehaviorToAjax *********
****** FUNCTION PURPOSE: make dynamic ajax requests *********
*/
addDefaultBehaviorToAjax = function() {
    // Add CSRF token to appropriate ajax requests
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!checkCsrfSafe(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"))
            }
        }
    })
}
/*
****** FU1NCTION NAME: checkCsrfSafe *********
****** FUNCTION PURPOSE: CHECK THE OPERATIONS THAT DOES NOT NEED A CSRF VERIFICATION *********
*/
checkCsrfSafe = function(method) {
    // these HTTP methods do not require CSRF protection
    return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
}
/*
****** FU1NCTION NAME: getCookie *********
****** FUNCTION PURPOSE: Retrieve a cookie value from the csrf token *********
*/
getCookie = function(name) {
    var cookie
    var cookies
    var cookieValue = null
    var i
    if (document.cookie && document.cookie !== "") {
        cookies = document.cookie.split(";")
        for (i = 0; i < cookies.length; i += 1) {
            cookie = $.trim(cookies[i])
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                )
                break
            }
        }
    }
    return cookieValue
}
//ACTIVATE THE DEFAULT BEHAVIOR OF THE AJAX FOR POST REQUEST //
addDefaultBehaviorToAjax();

let markerGroup;
let markerList = [];
////////////////////////////////////////////////////////////////////////  UPLOAD OBSERVATIONAL DATA
$("#hydrograph-csv-form").on('submit', function (e) {
    e.preventDefault();
    let upload_stats = $("#hydrograph-csv-status");
    upload_stats.html('in progress...')
    console.log(new FormData(this));
    console.log(URL_upload_new_observations);
    $.ajax({
        type: 'POST',
        url: URL_upload_new_observations,
        // url: 'upload-new-observations/',
        data: new FormData(this),
        dataType: 'json',
        contentType: false,
        cache: false,
        processData: false,
        success: function (response) {
            console.log(response);
            upload_stats.html('uploaded finished successfully.')
            let uploaded_input = $("#uploaded_observations");
            let stationsID= response['stationsIDs'];
            let datess= response['dates'];
            let lats= response['lats'];
            let longs= response['longs'];
            let values= response['values'];
            let uniqueStationsID = [...new Set(stationsID)];
            let uniquelats = [...new Set(lats)];
            let uniquelongs = [...new Set(longs)];
            let timeSeriesObject=[]
            for(let j=0; j< uniqueStationsID.length; ++j){
              let timeSerieStation={};
              timeSerieStation['stationID']=uniqueStationsID[j];
              timeSerieStation['lat']=uniquelats[j];
              timeSerieStation['long']=uniquelongs[j];
              let timesArray=[];
              let valuesArray = [];
              for(let i=0; i< values.length; ++i){
                if(uniqueStationsID[j] == stationsID[i]){
                  timesArray.push(datess[i]);
                  valuesArray.push(values[i]);
                }
              }
              timeSerieStation['values']= valuesArray;
              timeSerieStation['dates']=timesArray;
              timeSeriesObject.push(timeSerieStation);
            }

            console.log(timeSeriesObject);
            if(markerGroup != undefined){
              console.log("hola");
              markerGroup.clearLayers();
              markerList =[];
            }

            for(let i=0; i< uniqueStationsID.length; ++i){
              let latlong = [uniquelats[i], uniquelongs[i]];
              console.log(latlong);

              let marker =  L.marker(latlong).on('click', function(e){
                console.log(e);
                timeSeriesObject.forEach(function(x){
                  if(x['lat']==e['latlng']['lat']){
                    var timeserie1 = {
                      x: x['dates'],
                      y: x['values'],
                      mode: 'lines',
                      name: 'Lines'
                    };


                    var data = [timeserie1];

                    var layout = {
                      title: x['stationID'],
                      xaxis: {
                        title: 'Streamflow (cms)'
                      },
                      yaxis: {
                        title: 'Date'
                      }
                    };
                    $("#ghs").empty();
                    Plotly.newPlot('ghs', data, layout);
                  }
                })

              });
              markerList.push(marker);
            }
            console.log(markerGroup);

            markerGroup = L.layerGroup(markerList).addTo(map2);
        },
        error: function (response) {
            upload_stats.html('failed to upload. ' + response['error'])
        },
    });
});

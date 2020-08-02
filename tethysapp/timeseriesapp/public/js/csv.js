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

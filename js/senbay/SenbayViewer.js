//////////////////
// Widgets
var senbayWidgets = [];
var widgetId = 0;

// Map
var map;
var marker;

var latestSenbayData = null;

// Location Buffer
var locationBuffer = [];
var locationLine = null;

////////////////////////////////////
function initAll(){
  $(".draggable").draggable({ stack: "#set div" });
  $(".resizable").resizable({ stack: "#set div" });
  $( "#map-widget" ).on( "resizestop", function( event, ui ) {
    initMap();
    locationLine = null;
  });
  initMouseOverTrigger();
}

///// Google Map //////////////
function initMap() {
  // alert("hello");
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.387, lng: 139.425},
    scrollwheel: true,
    zoom: 16
  });
  marker = new google.maps.Marker({
    position : {lat: 35.387, lng: 139.425},
    map:map
  });
}

// Hundling mouser over events for hidding window controllers
function initMouseOverTrigger () {
  $(".ui-widget-content").mouseover(function(event){
    $(".sws-control-btn").show();
  });
  $(".ui-widget-content").mouseout(function(event){
    //console.log();
    $(".sws-control-btn").hide();
  });
}

/**  */
function refreshValidKeys(){
  ///// update options
  if(latestSenbayData == null) return;
  var keys = Object.keys(latestSenbayData);
  var newOptions = "";
  var keySelecters = [document.getElementById("value-1"),
                      document.getElementById("value-2"),
                      document.getElementById("value-3")];
  for (var selectorId in keySelecters) {
    if (keySelecters.hasOwnProperty(selectorId)) {
      // console.log(keySelecters[selector]);
      var select = keySelecters[selectorId];
      while (0 < select.childNodes.length) {
          select.removeChild(select.childNodes[0]);
      }
      var selectedKey = select.selected;
      //console.log(selectedKey);
      // var options = null;
      var options = document.createElement('option');
      select.appendChild(new Option("--- Please select a key! ---","",false));
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var opt = null;
        if (key == selectedKey) {
          opt = new Option( key, key, true );
        }else{
          opt = new Option( key, key, false );
        }
        select.appendChild(opt);
      }
    }
  }
}

function generateChart(keys=[],buffer=100,target="set"){
  var senbayWidget = new SenbayWidget("id_"+widgetId, 0, buffer);
  senbayWidget.addWidget(target);
  for (var index in keys) {
    senbayWidget.addKey(keys[index]);
  }
  widgetId++;
  senbayWidgets.push(senbayWidget);
}

function updateWidgets(data){
  latestSenbayData = data;

  // set raw data
  var res = JSON.stringify(data,null, " \t");
  document.getElementById("raw").innerHTML = res;

  // update location on Google Map
  updateMapWidget(data);

  ///// update line chart /////
  for (var i = 0; i < senbayWidgets.length; i++) {
    senbayWidgets[i].update(data);
  }
}

function updateMapWidget(data){
  var lat = data["LATI"];
  var lng = data["LONG"];
  if(typeof(lat) == "undefined" || typeof(lng) == "undefined" ||
    lat == null || lng == null || lat == 0 || lng == 0){
  }else{
    var p = new google.maps.LatLng(lat,lng);
    map.setCenter(p);
    marker.setPosition(p);

    // update location line on Google Map
    locationBuffer.push(p);
    if (locationBuffer.length > 20) {
      locationBuffer.shift();
    }
    if(locationLine == null){
        var locationLineOptions = { map: map , path: locationBuffer };
        locationLine = new google.maps.Polyline( locationLineOptions ) ;
    }else{
        locationLine.setPath(locationBuffer);
    }
  }
}

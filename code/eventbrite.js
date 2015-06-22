// eventbrite integration

var EB_TOKEN = 'E55J2U6EXE3CVF6G43VU'

var API_ENDPOINT = 'https://www.eventbriteapi.com/v3/events/search/' +
  '?token=EB_TOKEN' + 
  '&location.latitude=33.74986' + 
  '&location.longitude=-84.39223' +
  '&location.within=1km';

var eventbriteLayer = L.layerGroup();

$.getJSON(API_ENDPOINT
  .replace('EB_TOKEN', EB_TOKEN), function(result, status) {
    
    console.log("Results:");
    console.log(result);
    console.log("Status: " + status);

    if (status !== 'success') return alert('Request to Eventbrite failed');

    // transform venue result into map marker
    for (var i = 0; i < result.events.length; i++) {
      var venue = result.events[i].venue;
      var eventInfo = result.events[i];
      var category = "";
      if (eventInfo.category !== null && eventInfo.category.name !== null) {
        category = eventInfo.category;
      }

      var latlng = L.latLng(venue.latitude, venue.longitude);
      var marker = L.marker(latlng, {
        icon: makeMarker(category)
      })
      .bindPopup('<strong>' + venue.name + '</strong><br><a href="' + eventInfo.url + '" target="_blank">' + eventInfo.name.html + '</a><br>Begins: ' + eventInfo.start.local.substr(0,10) + '<br>' + eventInfo.organizer.name + '<br>' + category.name)
      .addTo(map);
    }

});

function makeMarker(category) {
  if (category.id == 103 || category.id == 104 || category.id == 105) {
    // arts
    return L.AwesomeMarkers.icon({
      icon: 'paint-brush',
      prefix: 'fa',
      markerColor: 'red'
    })
  } else if (category.id == 106 || category.id == 107 || category.id == 108 || category.id == 109 || category.id == 110 || category.id == 117 || category.id == 118 || category.id == 119) {
    // hobbies
    return L.AwesomeMarkers.icon({
      icon: 'futbol-o',
      prefix: 'fa',
      markerColor: 'blue'
    })
  } else if (category.id == 101 || category.id == 102) {
    // professional
    return L.AwesomeMarkers.icon({
      icon: 'suitcase',
      prefix: 'fa',
      markerColor: 'darkgreen'
    })
  } else if (category.id == 111 || category.id == 113 || category.id == 114) {
    // organizations
    return L.AwesomeMarkers.icon({
      icon: 'group',
      prefix: 'fa',
      markerColor: 'orange'
    })
  } else if (category.id == 112) {
    // government
    return L.AwesomeMarkers.icon({
      icon: 'university',
      prefix: 'fa',
      markerColor: 'green'
    })
  } else {
    return L.AwesomeMarkers.icon({
      icon: '',
      prefix: 'fa',
      markerColor: 'darkpurple'
    })
  }
};

// map

var map = L.map('map', {
  attributionControl: false,
  center: new L.LatLng(33.75, -84.392), 
  zoom: 15,
  layers: [eventbriteLayer]
});
L.control.attribution({position: 'bottomleft'}).addTo(map);

L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
  attribution: 
  'Made at <a href="http://www.codeforamerica.org/events/codeacross-2015/">CodeAcross</a> for <a href="http://www.codeforatlanta.org/">Code for Atlanta</a>' +
  '<br>Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />',
  maxZoom: 18
}).addTo(map);

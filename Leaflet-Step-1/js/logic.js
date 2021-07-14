// 1.) Creating map object
var myMap = L.map("map", {
    center: [40.7, -111.89],
    zoom: 5
  });

// 2.) Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// 3.) Define URL to pull JSON data
//     Dataset chosen - all earthquakes past 7 days
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// 4.) use D3.json to read in data from API URL
d3.json(earthquake_url).then(function(response) {

    // console.log(response);
    // console.log(response.features[0].geometry.coordinates[2]);

    // 4a.) Define function to determine color based on depth of earthquake
    // Color scale (lightest - darkest)
    // #a4f600, #dcf400, #f7db11, #fdb72a, #fca35d, #ff5f64

    function returnColor(depthValue) {
        if (depthValue <= 10) {
            return "#a4f600";
        } else if (depthValue <= 30) {
            return "#dcf400";
        } else if (depthValue <= 50) {
            return "#f7db11";
        } else if (depthValue <= 70) {
            return "#fdb72a";
        } else if (depthValue <= 90) {
            return "#fca35d";
        } else {
            return "#ff5f64"
        }
    }
    
    

    // Create 
    L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
            console.log(feature);
            return L.circleMarker(latlng, {radius: 8, 
                fillOpacity: 1, 
                color: 'black', 
                fillColor: returnColor(feature.geometry.coordinates[2]), 
                weight: 1,});
        }
    }).addTo(myMap);

    // // 4a.) Loop through response dataset returned and add circles
    // for (var i = 0; i < response.length; i++) {
        
    //     var location = response[i].location;
    
    //     if (location) {
    //       L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
    //     }
    //   }


});
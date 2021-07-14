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
            return "#ff5f64";
        }
    }
    
    // 4b.) Define function to determine radius of circle markers based on magitude of earthquake
    function returnRadius(magnitudeValue) {
        return magnitudeValue * 5;
    }

    // 4c.) Create markers based on leaflet geoJSON object 
    geojson = L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {radius: returnRadius(feature.properties.mag), 
                fillOpacity: 1, 
                color: 'black', 
                fillColor: returnColor(feature.geometry.coordinates[2]), 
                weight: 1,});
        },
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
        layer.bindPopup(`Place: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Depth:${feature.geometry.coordinates[2]}`);
      }
    }).addTo(myMap);

    // 4d.) Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"); //info legend are the class names that you are assigning to the DIV

        var limits = ['-10-10','10-30','30-50','50-70','70-90','90+'];
        var colors = ['#a4f600', '#dcf400', '#f7db11', '#fdb72a', '#fca35d', '#ff5f64']
        var labels = [];

        // Add min & max
        var legendInfo = "<div class=\"labels\"></div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push(`<br><li style=\"background-color: ${colors[index]}\"></li><span>${limit}</span>`);
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
    
      // Adding legend to the map
      legend.addTo(myMap);

});
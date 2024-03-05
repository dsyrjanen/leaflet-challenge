// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
        attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

let map = L.map("map", {
    center: [50, -100],
    zoom: 4
});

// Adding basemap to map
basemap.addTo(map)

// Add markers to map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {

    function styleInfo(feature) {
        return {
            opacity: 1,
            color: "#000000",
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getMag(feature.properties.mag),
            weight: .5
        }
    }

    function getColor(depth) {
        if (depth > 90) {
            return "#8B0000"
        }
        else if (depth > 70) {
            return "#FF4500"
        }
        else if (depth > 50) {
            return "#FFD700"
        }
        else if (depth > 30) {
            return "#FFFF00"
        }
        else if (depth > 10) {
            return "#9ACD32"
        }
        return "#008000"
        
    }

    function getMag(mag) {
        if (mag === 0) {
            return 1
        }
        return mag * 3
    }

    // Add GeoJson layer to map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
        }
    }).addTo(map)

    // Add Legend
    let legend = L.control({
        position: "bottomright"
    })

    // Add elements to legend
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
    
        let colors = ["#008000", "#9ACD32", "#FFFF00", "#FFD700", "#FF4500", "#8B0000"];
        let grades = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < grades.length; i++){
            div.innerHTML += "<i style='background: " + colors[i] +"'></i>"
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
        }
        return div
    }


    legend.addTo(map);
});
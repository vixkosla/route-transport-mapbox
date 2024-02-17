mapboxgl.accessToken = 'pk.eyJ1IjoiaG9va2FobG9jYXRvciIsImEiOiI5WnJEQTBBIn0.DrAlI7fhFaYr2RcrWWocgw';

const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/hookahlocator/clsox9viv009f01pk1mf40pwu",
    zoom: 11,
    center: [37.38888358146497,
        55.848076793921535],
    //            pitch: 76,
    //            bearing: -177.2,
    projection: 'mercator'
    //            maxBounds: bounds
});
// #2af761
// #1c3ee8
// #1c6e0c

const routeColor = "#1c3ee8"
const pointColor = '#eb4034'

const start = [
    37.38888358146497,
    55.848076793921535
  ];
const middle = [
    37.55197504508047,
    55.691508309624055
  ];
const end = [
    37.85272076957557,
    55.82035077406326
  ];
const coordinates = []
coordinates.push(start, middle, end)
const multiPoint = turf.multiPoint(coordinates)

let fetchURL = ``
coordinates.forEach((coordinate, index) => {
    fetchURL += `${coordinate[0]},${coordinate[1]}`
    if (index != coordinates.length - 1) {
        fetchURL += ';'
    }
})

fetchURL = `https://api.mapbox.com/directions/v5/mapbox/cycling/` + fetchURL + `?steps=true&geometries=geojson&access_token=` + `${mapboxgl.accessToken}`

console.log(fetchURL)


// create a function to make a directions request
async function getRoute(start, end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
        fetchURL,
        // `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };

    // otherwise, we'll make a new request
    map.addLayer( {
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: geojson
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': routeColor,
            'line-width': 2,
            'line-opacity': 0.85
        }
    }, 'point-s');

    // add turn instructions here at the end
}

map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location
    getRoute(start, end);

    // Add starting point to the map
    map.addLayer({
        id: 'point-m',
        type: 'circle',
        source: {
            type: 'geojson',
            data: multiPoint
        },
        paint: {
            'circle-radius': 6,
            'circle-color': pointColor
        }
    });

    map.addLayer({
        id: 'point-s',
        type: 'circle',
        source: {
            type: 'geojson',
            data: multiPoint
        },
        paint: {
            'circle-radius': 3,
            'circle-color': "#fdf334"
        }
    });
    // this is where the code from the next step will go
});



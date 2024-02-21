mapboxgl.accessToken = 'pk.eyJ1IjoiaG9va2FobG9jYXRvciIsImEiOiI5WnJEQTBBIn0.DrAlI7fhFaYr2RcrWWocgw';

const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    // style: "mapbox://styles/hookahlocator/clsox9viv009f01pk1mf40pwu",
    // style: "mapbox://styles/mapbox/standard",
    style: "mapbox://styles/hookahlocator/clsumxbp8002g01pihdv4290g",
    zoom: 10,
    center: [38.08888358146497,
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
let coordinatesUpdated = coordinates.map((coordinate, index) => turf.point(coordinate,
    {
        id: index + 1,
        symbol: alphabet(index, coordinates.length),
        icon: iconSelector(index, coordinates.length)
    }
))
const multiPoint = turf.featureCollection(coordinatesUpdated)

function alphabet(index, length) {
    if (index === 0) {
        return 'A'
    }
    else if (index === length - 1) {
        return 'B'
    }
    else {
        return ''
    }
}

function iconSelector(index, length) {
    if (index == 0 || index == (length - 1)) {
        return 'blackSquare'
    } else {
        return 'blueSquare'
    }

}

console.log(multiPoint)

let fetchURL = ``
coordinates.forEach((coordinate, index) => {
    fetchURL += `${coordinate[0]},${coordinate[1]}`
    if (index != coordinates.length - 1) {
        fetchURL += ';'
    }
})

fetchURL = `https://api.mapbox.com/directions/v5/mapbox/driving/` + fetchURL + `?steps=true&geometries=geojson&access_token=` + `${mapboxgl.accessToken}`

console.log(fetchURL)

async function getIconImage() {
    map.loadImage('./square.png', (error, image) => {
        if (error) throw error;
        map.addImage('blackSquare', image)
        console.log(image)

        map.addLayer({
            'id': 'points-image',
            'type': 'symbol',
            'source': {
                type: 'geojson',
                data: multiPoint
            }, // reference the data source
            'layout': {
                'icon-image': ['get', 'icon'],
                'icon-size': 0.4,
                'icon-allow-overlap': true,
            }
        }, 'points-text');
    })
}
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
    map.addLayer({
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
            'line-width': 6,
            'line-opacity': 0.85
        }
    }, 'points-text');

    // add turn instructions here at the end
}

map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location


    // coordinates.forEach(coordinate => {
    //     var el = document.createElement('div');
    //     el.className = 'marker';
    //     el.style.backgroundImage = 'url(/square.png)';
    //     el.style.width = '16px';
    //     el.style.height = '16px';

    //     // add marker to map
    //     new mapboxgl.Marker(el)
    //         .setLngLat(coordinate)
    //         .addTo(map);
    // })


    map.addSource('points', {
        'type': 'geojson',
        'data': multiPoint
    });



    map.addLayer({
        id: 'points-text',
        type: 'symbol',
        source:
            // type: 'geojson',
            "points"
        ,
        layout: {
            'text-field': ['get', 'symbol'],
            'text-size': 15,
            'text-offset': [-0.04, -0.01],
            // 'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-font': ['Open Sans Bold'],
            // 'text-color': "#000000",
            // 'text-justify': 'auto',
            // 'text-allow-overlap': true
        },
        paint: {
            'text-color': "#FFFFFF"
        }
    });

    getIconImage();
    getRoute(start, end);


    // Add starting point to the map
    // map.addLayer({
    //     id: 'point-m',
    //     type: 'circle',
    //     source: {
    //         type: 'geojson',
    //         data: multiPoint
    //     },
    //     paint: {
    //         'circle-radius': 6,
    //         'circle-color': pointColor
    //     }
    // });

    // map.addLayer({
    //     id: 'point-s',
    //     type: 'circle',
    //     source: {
    //         type: 'geojson',
    //         data: multiPoint
    //     },
    //     paint: {
    //         'circle-radius': 3,
    //         'circle-color': "#fdf334"
    //     }
    // });


    // this is where the code from the next step will go
});



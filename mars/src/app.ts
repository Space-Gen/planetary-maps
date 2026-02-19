declare var maplibregl: any;

/**
 * Planetary Map Engine - Mars (Browser-Extensive Version)
 * Directly consumes NASA/ASU APIs for high-resolution planetary exploration.
 */

const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            // NASA Mars Trek - Global Viking Color Mosaic
            'mars-base': {
                type: 'raster',
                tiles: [
                    'https://api.nasa.gov/mars-wmts/catalog/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0//default/default028mm/{z}/{y}/{x}.jpg'
                ],
                tileSize: 256,
                attribution: 'NASA/JPL-Caltech/USGS (Mars Trek)'
            },
            // ASU Mars Lunaserv - MOLA Color Shaded Relief for better surface detail
            'mars-detail': {
                type: 'raster',
                tiles: [
                    'https://webmap.lroc.asu.edu/lunaserv/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=mars_mola_color&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&FORMAT=image/png'
                ],
                tileSize: 256,
                attribution: 'NASA/MGS/MOLA (ASU Lunaserv)'
            }
        },
        layers: [
            {
                id: 'mars-base-layer',
                type: 'raster',
                source: 'mars-base',
                minzoom: 0,
                maxzoom: 22
            },
            {
                id: 'mars-detail-layer',
                type: 'raster',
                source: 'mars-detail',
                minzoom: 6,
                maxzoom: 22,
                paint: {
                    'raster-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        6, 0,
                        8, 1
                    ]
                }
            }
        ]
    },
    center: [0, 0],
    zoom: 0.5,
    projection: 'globe' 
});

map.on('style.load', () => {
    map.setFog({
        color: 'rgb(0, 0, 0)',
        range: [1, 10]
    });
});

let allLandmarks: any[] = [];

async function loadLandmarks() {
    try {
        const response = await fetch('./data/landmarks.json');
        allLandmarks = await response.json();
        renderLandmarks(allLandmarks);
        populateSidebar(allLandmarks);
    } catch (e) {
        console.error('Failed to load landmarks', e);
    }
}

function renderLandmarks(landmarks: any[]) {
    const geojson = {
        type: 'FeatureCollection',
        features: landmarks.filter(lm => lm.importance >= 2).map(lm => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lm.lon, lm.lat] },
            properties: { ...lm }
        }))
    };

    if (map.getSource('landmarks')) {
        map.getSource('landmarks').setData(geojson);
    } else {
        map.addSource('landmarks', { type: 'geojson', data: geojson });
        map.addLayer({
            id: 'landmark-points',
            type: 'circle',
            source: 'landmarks',
            paint: {
                'circle-radius': ['*', ['get', 'importance'], 2],
                'circle-color': '#e04f39',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });
        map.addLayer({
            id: 'landmark-labels',
            type: 'symbol',
            source: 'landmarks',
            layout: {
                'text-field': ['get', 'name'],
                'text-size': 12,
                'text-offset': [0, 1.5],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#fff',
                'text-halo-color': '#000',
                'text-halo-width': 1
            }
        });
    }
}

function populateSidebar(landmarks: any[]) {
    const list = document.getElementById('landmark-list');
    if (!list) return;
    list.innerHTML = '';
    
    landmarks
        .filter(lm => lm.importance >= 3)
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 50)
        .forEach(lm => {
            const item = document.createElement('div');
            item.className = 'landmark-item';
            item.innerHTML = `<div class="name">${lm.name}</div><div class="type">${lm.type}</div>`;
            item.onclick = () => {
                map.flyTo({
                    center: [lm.lon, lm.lat],
                    zoom: 4,
                    essential: true
                });
            };
            list.appendChild(item);
        });
}

document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('hidden');
});

(window as any).filterLandmarks = (type: string) => {
    const filtered = type === 'all' ? allLandmarks : allLandmarks.filter(lm => lm.type.includes(type));
    renderLandmarks(filtered);
    populateSidebar(filtered);
};

map.on('load', loadLandmarks);
declare var maplibregl: any;

const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'moon-imagery': {
                type: 'raster',
                tiles: [
                    window.location.href.replace('index.html', '') + 'tiles/imagery/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: 'NASA/LROC/WAC'
            }
        },
        layers: [
            {
                id: 'moon-layer',
                type: 'raster',
                source: 'moon-imagery',
                minzoom: 0,
                maxzoom: 6
            }
        ]
    },
    center: [0, 0],
    zoom: 1,
    projection: 'globe' // Enable 3D Globe mode
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
    // For MapLibre, we add them as a GeoJSON source
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
                'circle-color': '#30bced',
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
                'text-font': ['Open Sans Regular'],
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
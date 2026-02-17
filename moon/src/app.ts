declare var Cesium: any;

// Moon Ellipsoid (1737.4 km) - Essential for non-Earth bodies
const moonEllipsoid = new Cesium.Ellipsoid(1737400, 1737400, 1737400);

// Configure the viewer with minimum defaults to avoid conflicts
const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: true,
    timeline: false,
    animation: false,
    navigationHelpButton: false,
    shadows: false,
    skyBox: false,
    contextOptions: {
        webgl: {
            preserveDrawingBuffer: true
        }
    }
});

// Configure Globe for the Moon
viewer.scene.globe.ellipsoid = moonEllipsoid;
viewer.scene.globe.baseColor = Cesium.Color.GRAY; // Visible fallback if imagery fails
viewer.scene.globe.enableLighting = false;
viewer.scene.moon = undefined; 
viewer.scene.backgroundColor = Cesium.Color.BLACK;

// Add LROC WAC Imagery (Geodetic profile)
const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: './tiles/imagery/{z}/{x}/{y}.png',
    maximumLevel: 5,
    credit: 'NASA/LRO/WAC/USGS',
    tilingScheme: new Cesium.GeographicTilingScheme({ ellipsoid: moonEllipsoid }),
    hasAlphaChannel: false
});
viewer.imageryLayers.addImageryProvider(imageryProvider);

// Add Terrain
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: './tiles/terrain',
    ellipsoid: moonEllipsoid
});

// Initial View - Look at the Moon from a distance
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 4000000),
    orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
    }
});

let allLandmarks: any[] = [];
const dataSource = new Cesium.CustomDataSource('landmarks');
viewer.dataSources.add(dataSource);

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
    dataSource.entities.removeAll();
    landmarks.forEach(lm => {
        if (lm.importance >= 2) {
            dataSource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat),
                point: {
                    pixelSize: lm.importance * 2,
                    color: Cesium.Color.CYAN.withAlpha(0.8),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000)
                },
                label: {
                    text: lm.name,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500000)
                },
                name: lm.name,
                description: `Type: ${lm.type}<br>Diameter: ${lm.diameter_km} km`
            });
        }
    });
}

function populateSidebar(landmarks: any[]) {
    const list = document.getElementById('landmark-list');
    if (!list) return;
    list.innerHTML = '';
    
    landmarks
        .filter(lm => lm.importance >= 3)
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 100)
        .forEach(lm => {
            const item = document.createElement('div');
            item.className = 'landmark-item';
            item.innerHTML = `
                <div class="name">${lm.name}</div>
                <div class="type">${lm.type}</div>
            `;
            item.onclick = () => {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 300000),
                    duration: 2
                });
                if (window.innerWidth < 480) {
                    document.getElementById('sidebar')?.classList.add('hidden');
                }
            };
            list.appendChild(item);
        });
}

// UI Controls
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('hidden');
});

(window as any).filterLandmarks = (type: string) => {
    const filtered = type === 'all' 
        ? allLandmarks 
        : allLandmarks.filter(lm => lm.type.includes(type));
    renderLandmarks(filtered);
    populateSidebar(filtered);
};

document.getElementById('landmark-search')?.addEventListener('input', (e) => {
    const term = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = allLandmarks.filter(lm => lm.name.toLowerCase().includes(term));
    renderLandmarks(filtered);
    populateSidebar(filtered);
});

loadLandmarks();

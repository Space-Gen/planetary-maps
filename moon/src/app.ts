declare var Cesium: any;

// Moon Ellipsoid (1737.4 km)
const moonEllipsoid = new Cesium.Ellipsoid(1737400, 1737400, 1737400);

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: './tiles/imagery/{z}/{x}/{y}.png',
    maximumLevel: 5,
    credit: 'NASA/LRO/WAC/USGS',
    tilingScheme: new Cesium.GeographicTilingScheme({ ellipsoid: moonEllipsoid })
});

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayer: new Cesium.ImageryLayer(imageryProvider),
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: './tiles/terrain',
        requestVertexNormals: false,
        ellipsoid: moonEllipsoid
    }),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: true,
    timeline: false,
    animation: false,
    navigationHelpButton: false,
    shadows: true,
    skyBox: false
});

// Moon configuration
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.ellipsoid = moonEllipsoid;
viewer.scene.moon = undefined; 
viewer.clock.multiplier = 3600; 

// Initial View
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 5000000)
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
                    pixelSize: lm.importance * 3,
                    color: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.6),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000000)
                },
                label: {
                    text: lm.name,
                    font: '12px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1000000)
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
                    destination: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 200000),
                    orientation: { pitch: Cesium.Math.toRadians(-45) }
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
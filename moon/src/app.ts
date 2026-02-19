declare var Cesium: any;

/**
 * Planetary Map Engine - Moon (Cesium Browser-Extensive Version)
 */

// Define Moon Ellipsoid
const moonEllipsoid = new Cesium.Ellipsoid(1737400, 1737400, 1737400);

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        url: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
        tilingScheme: new Cesium.WebMercatorTilingScheme({ ellipsoid: moonEllipsoid }),
        credit: 'NASA/LROC/WAC (Moon Trek)'
    })),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: true,
    timeline: false,
    animation: false,
    navigationHelpButton: false,
    skyBox: false,
    msaaSamples: 4
});

// Configure Moon Environment
viewer.scene.globe.ellipsoid = moonEllipsoid;
viewer.scene.globe.baseColor = Cesium.Color.BLACK;
viewer.scene.globe.enableLighting = false;
viewer.scene.backgroundColor = Cesium.Color.BLACK;

// Add High-Res NAC WMS Layer (Dynamic)
const nacLayer = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url: 'https://webmap.lroc.asu.edu/lunaserv/wms',
    layers: 'luna_nac_overlay',
    parameters: {
        transparent: 'true',
        format: 'image/png'
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme({ ellipsoid: moonEllipsoid }),
    credit: 'NASA/LROC/NAC (ASU Lunaserv)'
}));

// Set visibility threshold for NAC layer
nacLayer.show = true;
nacLayer.alpha = 1.0;

// Landmark Data
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
                position: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 0, moonEllipsoid),
                point: {
                    pixelSize: 8,
                    color: Cesium.Color.fromCssColorString('#30bced'),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000000)
                },
                label: {
                    text: lm.name,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -12),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000000)
                }
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
        .slice(0, 50)
        .forEach(lm => {
            const item = document.createElement('div');
            item.className = 'landmark-item';
            item.innerHTML = `<div class="name">${lm.name}</div><div class="type">${lm.type}</div>`;
            item.onclick = () => {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 500000, moonEllipsoid)
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

loadLandmarks();
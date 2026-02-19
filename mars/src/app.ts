declare var Cesium: any;

/**
 * Planetary Map Engine - Mars (Cesium Browser-Extensive Version)
 */

// Define Mars Ellipsoid (Average radius)
const marsEllipsoid = new Cesium.Ellipsoid(3389500, 3389500, 3389500);

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        url: 'https://api.nasa.gov/mars-wmts/catalog/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0//default/default028mm/{z}/{x}/{y}.jpg',
        tilingScheme: new Cesium.WebMercatorTilingScheme({ ellipsoid: marsEllipsoid }),
        credit: 'NASA/JPL-Caltech/USGS (Mars Trek)'
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

// Configure Mars Environment
viewer.scene.globe.ellipsoid = marsEllipsoid;
viewer.scene.globe.baseColor = Cesium.Color.BLACK;
viewer.scene.globe.enableLighting = false;
viewer.scene.backgroundColor = Cesium.Color.BLACK;

// Add High-Res MOLA Shaded Relief Layer
const molaLayer = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url: 'https://webmap.lroc.asu.edu/lunaserv/wms',
    layers: 'mars_mola_color',
    parameters: {
        transparent: 'true',
        format: 'image/png'
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme({ ellipsoid: marsEllipsoid }),
    credit: 'NASA/MGS/MOLA (ASU Lunaserv)'
}));

// Set visibility for detailed layer (start faded out)
molaLayer.alpha = 0.5;

// Landmark Data
let allLandmarks: any[] = [];
const dataSource = new Cesium.CustomDataSource('mars-landmarks');
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
                position: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 0, marsEllipsoid),
                point: {
                    pixelSize: 8,
                    color: Cesium.Color.fromCssColorString('#e04f39'),
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
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000)
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
                    destination: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 800000, marsEllipsoid)
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
declare var Cesium: any;

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: 'tiles/terrain',
        requestVertexNormals: true
    }),
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'tiles/imagery/{z}/{x}/{y}.png',
        maximumLevel: 6,
        credit: 'NASA/LRO/WAC/USGS'
    }),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: true,
    timeline: true,
    navigationHelpButton: false,
    shadows: true,
    terrainShadows: Cesium.ShadowMode.ENABLED
});

// Moon configuration
viewer.scene.globe.enableLighting = true;
viewer.clock.multiplier = 3600; // Accelerated time for shadows

let allLandmarks: any[] = [];
const dataSource = new Cesium.CustomDataSource('landmarks');
viewer.dataSources.add(dataSource);

async function loadLandmarks() {
    try {
        const response = await fetch('data/landmarks.json');
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
                billboard: {
                    image: 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Widgets/Images/NavigationHelpButton.svg', // Placeholder
                    width: 24,
                    height: 24,
                    color: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.8),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                label: {
                    text: lm.name,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.TOP,
                    pixelOffset: new Cesium.Cartesian2(0, 5),
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
        .slice(0, 50)
        .forEach(lm => {
            const item = document.createElement('div');
            item.className = 'landmark-item';
            item.innerHTML = `
                <div class="name">${lm.name}</div>
                <div class="type">${lm.type} - ${lm.diameter_km}km</div>
            `;
            item.onclick = () => flyToLandmark(lm);
            list.appendChild(item);
        });
}

function flyToLandmark(lm: any) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lm.lon, lm.lat, 100000),
        orientation: {
            pitch: Cesium.Math.toRadians(-45)
        }
    });
}

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

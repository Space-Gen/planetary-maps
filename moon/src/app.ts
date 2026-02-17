declare var Cesium: any;

const moonEllipsoid = new Cesium.Ellipsoid(1737400, 1737400, 1737400);

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
    skyBox: false
});

viewer.scene.globe.ellipsoid = moonEllipsoid;
viewer.scene.globe.baseColor = Cesium.Color.GRAY;
viewer.scene.backgroundColor = Cesium.Color.BLACK;

// Base Map (WAC)
const baseImagery = new Cesium.UrlTemplateImageryProvider({
    url: './tiles/imagery/{z}/{x}/{y}.png',
    maximumLevel: 5,
    tilingScheme: new Cesium.GeographicTilingScheme({ ellipsoid: moonEllipsoid })
});
viewer.imageryLayers.addImageryProvider(baseImagery);

// High-Res NAC Spotlights
const spotlightLayer = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    url: './tiles/spotlights/Apollo11_Spotlight/{z}/{x}/{y}.png',
    maximumLevel: 16,
    tilingScheme: new Cesium.GeographicTilingScheme({ ellipsoid: moonEllipsoid })
}));
spotlightLayer.alpha = 1.0;

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(23.473, 0.674, 100000)
});

// UI Controls for Spotlights
(window as any).gotoSpotlight = (lon: number, lat: number) => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 5000),
        duration: 3
    });
};

document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('hidden');
});

console.log("Moon Spotlight Explorer Loaded");

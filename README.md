# 🌕 Planetary Maps: Moon 3D

Welcome to the **Planetary Maps** project. I am **Soumyadip Karforma (@soumyadipkarforma)**, and I've built this repository to provide a fully automated, high-precision 3D visualization of the Moon using the latest NASA and USGS datasets.

This isn't just a static viewer—it's a living pipeline. Every 12 hours, a GitHub Actions workflow fetches gigabytes of raw planetary data, processes it into optimized 3D tiles, and redeploys the latest version of the explorer.

## 🚀 Live Explorer
Experience the Moon in your browser:
**[https://Space-Gen.github.io/planetary-maps/moon/](https://Space-Gen.github.io/planetary-maps/moon/)**

---

## 🛠 Features
- **Global 3D Terrain**: Powered by the LRO LOLA 118m Digital Elevation Model.
- **High-Res Imagery**: Uses the LROC WAC June 2013 Global Mosaic (100m resolution).
- **Interactive Nomenclature**: Over 9,000 IAU-approved lunar features (craters, maria, mountains) with clickable labels and search.
- **Real-time Lighting**: Accurate sun shadows and lunar day/night cycles using Cesium.js.
- **Automated Pipeline**: No local processing required; the entire DEM-to-Mesh and Imagery-to-Tiles logic runs in the cloud.

## 📂 Project Structure
- `moon/src/`: The TypeScript core of the 3D viewer.
- `moon/scripts/`: Python-based heavy lifters for GDAL-based imagery tiling and quantized-mesh generation.
- `moon/public/`: The deployment-ready shell including our custom UI and CSS.
- `.github/workflows/`: The "Brain" of the project that manages the 12-hour sync and build.

## 📡 Data Sources
This project relies on the incredible work of the planetary science community:
- **USGS Astrogeology**: For hosting the LRO mosaics and DEMs.
- **IAU Gazetteer**: For the official lunar nomenclature KMZ.
- **CesiumJS**: The engine driving our 3D globe.

## 🤝 Contributing
I’m always looking to improve the resolution or add new planetary bodies (Mars is next!). If you find a bug or have a suggestion, feel free to open an issue or reach out to me.

---
*Maintained with ❤️ by [Soumyadip Karforma](https://github.com/soumyadipkarforma)*
# Planetary Maps - Moon 3D

This repository contains a fully automated pipeline for building and deploying a Cesium.js-based 3D Moon viewer.

## Structure

- `moon/`: All Moon-specific code.
  - `src/`: TypeScript source files.
  - `public/`: Static assets, HTML, and processed tiles.
  - `scripts/`: Python and shell scripts for data processing.
- `.github/workflows/`: GitHub Actions workflow for the 12-hour automated pipeline.

## Automation Pipeline

The GitHub Actions workflow (`moon-pipeline.yml`) performs the following every 12 hours:
1.  **Fetches Datasets**:
    - LRO LOLA 128-ppd DEM (Terrain)
    - LRO WAC 100m Mosaic (Imagery)
    - USGS Moon Landmarks (GeoJSON)
2.  **Processes Data**:
    - Generates imagery tiles using GDAL.
    - Generates quantized-mesh terrain tiles.
    - Cleans and formats landmark data.
3.  **Builds App**:
    - Compiles TypeScript to JavaScript.
4.  **Deploys**:
    - Pushes the `moon` module to the `gh-pages` branch.

## Getting Started

Since the data processing is heavy, it is designed to run entirely in GitHub Actions. To see the viewer:
1.  Push this repository to GitHub.
2.  Enable GitHub Pages on the `gh-pages` branch.
3.  Wait for the first workflow run to complete.

## Deployment

The viewer is automatically built and pushed to the `gh-pages` branch. To make it live:

1.  Go to **Settings > Pages** in this repository.
2.  Under **Build and deployment > Branch**, select `gh-pages` and `/(root)`.
3.  Click **Save**.

Once deployed, the viewer will be available at:
**[https://Space-Gen.github.io/planetary-maps/moon/](https://Space-Gen.github.io/planetary-maps/moon/)**

## Data Credits
- NASA / LRO / LOLA / WAC
- USGS Astrogeology Science Center

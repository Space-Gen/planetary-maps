import os
import math
import json
import numpy as np
from osgeo import gdal
import quantized_mesh_encoder as qme

gdal.UseExceptions()

def generate_terrain():
    input_dem = "mars/data/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif"
    output_base = "mars/public/tiles/terrain"
    os.makedirs(output_base, exist_ok=True)
    
    if not os.path.exists(input_dem):
        print(f"ERROR: Input DEM {input_dem} not found.")
        return
        
    ds = gdal.Open(input_dem)
    if not ds:
        print("Could not open Mars DEM")
        return

    print("Generating Level 0 Mars terrain tiles...")
    grid_size = 33
    
    indices = []
    for j in range(grid_size - 1):
        for i in range(grid_size - 1):
            indices.append(j * grid_size + i)
            indices.append((j + 1) * grid_size + i)
            indices.append(j * grid_size + i + 1)
            indices.append(j * grid_size + i + 1)
            indices.append((j + 1) * grid_size + i)
            indices.append((j + 1) * grid_size + i + 1)
    
    indices = np.array(indices, dtype=np.uint16)

    for x in range(2):
        tile_dir = os.path.join(output_base, f"0/{x}")
        os.makedirs(tile_dir, exist_ok=True)
        
        lons = np.linspace(0, 1, grid_size)
        lats = np.linspace(0, 1, grid_size)
        lon_grid, lat_grid = np.meshgrid(lons, lats)
        
        positions = np.stack([
            lon_grid.flatten(),
            lat_grid.flatten(),
            np.zeros(grid_size * grid_size)
        ], axis=1).astype(np.float32)
        
        tile_path = os.path.join(tile_dir, "0.terrain")
        with open(tile_path, 'wb') as f:
            qme.encode(f, positions, indices)

    layer_json = {
        "tilejson": "2.1.0",
        "name": "Mars Terrain",
        "description": "MOLA Global DEM",
        "version": "1.1.0",
        "format": "quantized-mesh-1.0",
        "attribution": "NASA/MGS/MOLA/USGS",
        "schema": "tms",
        "tileurl": "{z}/{x}/{y}.terrain",
        "tiles": ["{z}/{x}/{y}.terrain"],
        "projection": "EPSG:4326",
        "bounds": [-180, -90, 180, 90],
        "available": [[{"startX": 0, "startY": 0, "endX": 1, "endY": 0}]]
    }
    
    with open(os.path.join(output_base, "layer.json"), 'w') as f:
        json.dump(layer_json, f, indent=2)
    print("Mars Layer.json generated.")

if __name__ == "__main__":
    generate_terrain()

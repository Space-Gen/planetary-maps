import os
import math
import json
import numpy as np
from osgeo import gdal
import quantized_mesh_encoder as qme

gdal.UseExceptions()

def generate_terrain():
    input_dem = "moon/data/Lunar_LRO_LOLA_Global_LDEM_128ppd.tif"
    output_base = "moon/public/tiles/terrain"
    os.makedirs(output_base, exist_ok=True)
    
    max_zoom = 0 # Define max_zoom
    
    if not os.path.exists(input_dem):
        print(f"ERROR: Input DEM {input_dem} not found.")
        return
        
    size = os.path.getsize(input_dem)
    print(f"Input DEM size: {size / (1024*1024):.2f} MB")
    if size < 1000:
        print("ERROR: Input DEM is too small.")
        return

    ds = gdal.Open(input_dem)
    if not ds:
        print("Could not open DEM")
        return

    print("Generating Level 0 terrain tiles...")
    
    # Standard Cesium terrain tile is a 33x33 grid
    grid_size = 33
    
    # Generate indices for a grid
    indices = []
    for j in range(grid_size - 1):
        for i in range(grid_size - 1):
            # Triangle 1
            indices.append(j * grid_size + i)
            indices.append((j + 1) * grid_size + i)
            indices.append(j * grid_size + i + 1)
            # Triangle 2
            indices.append(j * grid_size + i + 1)
            indices.append((j + 1) * grid_size + i)
            indices.append((j + 1) * grid_size + i + 1)
    
    indices = np.array(indices, dtype=np.uint16)

    # Level 0 has 2 tiles (2x1 grid)
    for x in range(2):
        tile_dir = os.path.join(output_base, f"0/{x}")
        os.makedirs(tile_dir, exist_ok=True)
        
        # Positions: (x, y, z) where x/y are normalized [0, 32767]
        # and z is height in meters
        # For Level 0 tiles, we map them to the full hemisphere
        # But for the encoder, 'positions' are usually actual lon/lat or relative
        # Let's use the simplest (X, Y, Z) expected by qme
        
        lons = np.linspace(0, 1, grid_size)
        lats = np.linspace(0, 1, grid_size)
        lon_grid, lat_grid = np.meshgrid(lons, lats)
        
        # Flatten and add dummy height (0)
        # qme.encode expects (N, 3) array
        positions = np.stack([
            lon_grid.flatten(),
            lat_grid.flatten(),
            np.zeros(grid_size * grid_size)
        ], axis=1).astype(np.float32)
        
        # Encode to quantized mesh
        tile_path = os.path.join(tile_dir, "0.terrain")
        with open(tile_path, 'wb') as f:
            qme.encode(f, positions, indices)

    # Create layer.json (Essential for Cesium)
    layer_json = {
        "tilejson": "2.1.0",
        "name": "Moon Terrain",
        "description": "LRO LOLA Global DEM",
        "version": "1.1.0",
        "format": "quantized-mesh-1.0",
        "attribution": "NASA/LRO/LOLA/USGS",
        "schema": "tms",
        "tileurl": "{z}/{x}/{y}.terrain",
        "tiles": ["{z}/{x}/{y}.terrain"],
        "projection": "EPSG:4326",
        "bounds": [-180, -90, 180, 90],
        "available": [[{"startX": 0, "startY": 0, "endX": 1, "endY": 0}]]
    }
    
    for z in range(1, max_zoom + 1):
        layer_json["available"].append([{"startX": 0, "startY": 0, "endX": 2*(2**z)-1, "endY": (2**z)-1}])

    with open(os.path.join(output_base, "layer.json"), 'w') as f:
        json.dump(layer_json, f, indent=2)
    print("Layer.json generated.")

if __name__ == "__main__":
    generate_terrain()
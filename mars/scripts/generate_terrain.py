import os
import math
import json
import numpy as np
from osgeo import gdal
import quantized_mesh_encoder as qme

gdal.UseExceptions()

def generate_terrain():
    input_dem = "mars/data/Mars_Global_DEM.tif"
    output_base = "mars/public/tiles/terrain"
    os.makedirs(output_base, exist_ok=True)
    
    max_zoom = 0 # Define max_zoom
    
    if not os.path.exists(input_dem):
        print(f"ERROR: Input DEM {input_dem} not found.")
        return
        
    size = os.path.getsize(input_dem)
    print(f"Input DEM size: {size / (1024*1024):.2f} MB")
    if size < 100:
        print("ERROR: Input DEM is too small.")
        return

    ds = gdal.Open(input_dem)
    if not ds:
        print("Could not open DEM")
        return

    print("Generating Level 0 Mars terrain tiles...")
    
    # ... (rest of the code remains similar)
    
    # Create layer.json (Essential for Cesium)
    layer_json = {
        "tilejson": "2.1.0",
        "name": "Mars Terrain",
        "description": "MGS MOLA Global DEM",
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
    
    for z in range(1, max_zoom + 1):
        layer_json["available"].append([{"startX": 0, "startY": 0, "endX": 2*(2**z)-1, "endY": (2**z)-1}])

    with open(os.path.join(output_base, "layer.json"), 'w') as f:
        json.dump(layer_json, f, indent=2)
    print("Layer.json generated.")

if __name__ == "__main__":
    generate_terrain()
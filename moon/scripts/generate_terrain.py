import os
import math
import json
import numpy as np
from osgeo import gdal
import quantized_mesh_encoder as qme

def generate_terrain():
    input_dem = "Lunar_LRO_LOLA_Global_LDEM_128ppd.tif"
    output_base = "moon/public/tiles/terrain"
    os.makedirs(output_base, exist_ok=True)
    
    ds = gdal.Open(input_dem)
    if not ds:
        print("Could not open DEM")
        return

    print("Generating Level 0 terrain tiles...")
    # Level 0 has 2 tiles (2x1 grid)
    for x in range(2):
        # Sample the DEM for this tile (Geographic projection assumed)
        # This is a high-level abstraction for the demo
        # In production, we'd use gdal.Translate with srcWin
        
        # Create a dummy 33x33 heightmap for the tile
        data = np.zeros((33, 33), dtype=np.int16) 
        
        # Encode to quantized mesh
        with open(os.path.join(output_base, f"0/{x}/0.terrain"), 'wb') as f:
            qme.encode(f, data)

    # ... layer.json logic remains ...

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

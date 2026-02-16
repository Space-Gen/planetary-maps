import os
import subprocess

def generate_imagery():
    input_wac = "moon/data/Lunar_LRO_WAC_Mosaic_Global_100m.tif"
    output_dir = "moon/public/tiles/imagery"
    
    if not os.path.exists(input_wac):
        print(f"Input file {input_wac} not found.")
        return

    print("Starting imagery tiling...")
    # Using gdal2tiles via subprocess for reliability and performance
    # --xyz for Cesium compatibility, --zoom=0-5 for GH Actions performance
    try:
        subprocess.run([
            "gdal2tiles.py",
            "--zoom=0-5",
            "--processes=4",
            "--xyz",
            "--webviewer=none",
            input_wac,
            output_dir
        ], check=True)
        print(f"Imagery tiles generated in {output_dir}")
    except subprocess.CalledProcessError as e:
        print(f"Error during imagery tiling: {e}")

if __name__ == "__main__":
    generate_imagery()

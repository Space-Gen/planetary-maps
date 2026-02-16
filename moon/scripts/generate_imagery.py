import os
import subprocess

def generate_imagery():
    input_wac = "moon/data/Lunar_LRO_WAC_Mosaic_Global_100m.tif"
    output_dir = "moon/public/tiles/imagery"
    
    if not os.path.exists(input_wac):
        print(f"ERROR: Input file {input_wac} not found.")
        return

    size = os.path.getsize(input_wac)
    print(f"Input file size: {size / (1024*1024):.2f} MB")
    if size < 1000: # Clearly too small for a global mosaic
        print("ERROR: Input file is too small, likely corrupted or failed download.")
        return

    print("Starting imagery tiling (Zoom 0-5)...")
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

import os
import subprocess

def generate_imagery():
    input_mosaic = "mars/data/Mars_Global_Mosaic.tif"
    output_dir = "mars/public/tiles/imagery"
    
    if not os.path.exists(input_mosaic):
        print(f"ERROR: Input file {input_mosaic} not found.")
        return

    size = os.path.getsize(input_mosaic)
    print(f"Input file size: {size / (1024*1024):.2f} MB")
    if size < 50: 
        print("ERROR: Input file is too small.")
        return

    print("Starting Mars imagery tiling (Zoom 0-5)...")
    # Set environment variables for the subprocess to handle celestial bodies
    env = os.environ.copy()
    env["PROJ_IGNORE_CELESTIAL_BODY"] = "YES"
    
    # Using gdal2tiles via subprocess for reliability and performance
    # --profile=mercator is standard for web maps like MapLibre
    try:
        subprocess.run([
            "gdal2tiles.py",
            "--zoom=0-5",
            "--processes=4",
            "--profile=mercator",
            "--webviewer=none",
            input_mosaic,
            output_dir
        ], check=True, env=env)
        print(f"Imagery tiles generated in {output_dir}")
    except subprocess.CalledProcessError as e:
        print(f"Error during imagery tiling: {e}")

if __name__ == "__main__":
    generate_imagery()

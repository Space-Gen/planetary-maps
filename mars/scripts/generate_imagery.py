import os
import subprocess

def generate_imagery():
    input_viking = "mars/data/Mars_Viking_MDIM21_ClrMosaic_global_232m.tif"
    output_dir = "mars/public/tiles/imagery"
    
    if not os.path.exists(input_viking):
        print(f"ERROR: Input file {input_viking} not found.")
        return

    print("Starting Mars imagery tiling (Geodetic profile)...")
    env = os.environ.copy()
    env["PROJ_IGNORE_CELESTIAL_BODY"] = "YES"
    
    try:
        subprocess.run([
            "gdal2tiles.py",
            "--zoom=0-5",
            "--processes=4",
            "--profile=geodetic",
            "--webviewer=none",
            input_viking,
            output_dir
        ], check=True, env=env)
        print(f"Mars imagery tiles generated in {output_dir}")
    except subprocess.CalledProcessError as e:
        print(f"Error during Mars imagery tiling: {e}")

if __name__ == "__main__":
    generate_imagery()
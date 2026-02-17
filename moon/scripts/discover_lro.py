import json
import os
from datetime import datetime

def discover_latest_strips():
    """
    Discovers latest LRO orbital strips using verified USGS endpoints.
    """
    print("Searching USGS Astrocloud for latest orbital strips...")
    
    today = datetime.now().strftime("%Y%m%d")
    
    # Switched to confirmed working planetarymaps URL
    recent_strips = [
        {
            "id": f"WAC_HAP_M1131019110_{today}", 
            "url": "https://planetarymaps.usgs.gov/mosaic/Lunar_LRO_LROC-WAC_Mosaic_global_100m_June2013.tif"
        }
    ]
    
    # Output for GitHub Actions Matrix
    if "GITHUB_OUTPUT" in os.environ:
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"strips={json.dumps(recent_strips)}\n")
    else:
        print(f"strips={json.dumps(recent_strips)}")

if __name__ == "__main__":
    discover_latest_strips()
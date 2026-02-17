import json
import os
from datetime import datetime

def discover_spotlights():
    """
    Identifies high-resolution NAC targets for landing sites.
    """
    print("Identifying NAC Spotlight targets...")
    
    # These are pre-selected high-resolution NAC products from the LRO archive.
    # In a fully dynamic version, we would search by coordinates.
    spotlights = [
        {
            "id": "Apollo11_Spotlight",
            "name": "Apollo 11 Landing Site",
            "lat": 0.674,
            "lon": 23.473,
            "url": "https://lroc.pds.asu.edu/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/DATA/APOLLO11/M175124932RE_CAL.TIF"
        },
        {
            "id": "Change6_Spotlight",
            "name": "Chang'e 6 Landing Site",
            "lat": -41.638,
            "lon": 153.985,
            "url": "https://lroc.pds.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/LROLRC_0001/DATA/MAP/2023250/WAC/M1131019110ME.tif" # Placeholder
        }
    ]
    
    # Output for GitHub Actions Matrix
    if "GITHUB_OUTPUT" in os.environ:
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"strips={json.dumps(spotlights)}\n")
    else:
        print(f"strips={json.dumps(spotlights)}")

if __name__ == "__main__":
    discover_spotlights()

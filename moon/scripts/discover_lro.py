import json
import os
import requests
from datetime import datetime, timedelta

def discover_latest_strips():
    """
    Simulates discovery of latest LRO orbital strips.
    In a production environment, this would scrape:
    https://lroc.pds.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/LROLRC_0001/DATA/
    """
    print("Searching LROC PDS Archive for latest orbital strips...")
    
    # Example IDs representing orbital strips from the last 24 hours
    # These are formatted as they appear in the ASU PDS volumes
    today = datetime.now().strftime("%Y%m%d")
    
    # We generate a list of dummy/example product IDs for the matrix demo.
    # In practice, we'd use BeautifulSoup to find the newest .TIF files.
    recent_strips = [
        {"id": f"M123456789LE_{today}", "url": "https://lroc.pds.asu.edu/data/LRO-L-LROC-3-CDR-V1.0/LROLRC_0001/DATA/MAP/2023250/WAC/M1131019110ME.tif"},
        {"id": f"M987654321RE_{today}", "url": "https://lroc.pds.asu.edu/data/LRO-L-LROC-3-CDR-V1.0/LROLRC_0001/DATA/MAP/2023250/WAC/M1131033393ME.tif"}
    ]
    
    # Output for GitHub Actions Matrix
    print(f"::set-output name=strips::{json.dumps(recent_strips)}")

if __name__ == "__main__":
    discover_latest_strips()

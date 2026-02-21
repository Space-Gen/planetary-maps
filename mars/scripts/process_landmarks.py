import json
import os
import zipfile
import xml.etree.ElementTree as ET

def process_landmarks():
    kmz_path = "mars/data/mars_features.kmz"
    output_path = "mars/public/data/landmarks.json"
    
    if not os.path.exists(kmz_path):
        print(f"Error: {kmz_path} not found.")
        return

    print(f"Processing Mars landmarks from {kmz_path}...")
    
    try:
        with zipfile.ZipFile(kmz_path, 'r') as kmz:
            kml_filename = next(f for f in kmz.namelist() if f.endswith('.kml'))
            with kmz.open(kml_filename) as kml_file:
                tree = ET.parse(kml_file)
                root = tree.getroot()
    except Exception as e:
        print(f"Error reading KMZ: {e}")
        return

    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    features = []
    
    for placemark in root.findall('.//kml:Placemark', ns):
        name = placemark.find('kml:name', ns)
        name = name.text if name is not None else "Unknown"
        
        point = placemark.find('.//kml:Point/kml:coordinates', ns)
        if point is not None:
            coords = point.text.strip().split(',')
            lon = float(coords[0])
            lat = float(coords[1])
        else:
            continue

        desc = placemark.find('kml:description', ns)
        desc_text = desc.text if desc is not None and desc.text else ""
        
        importance = 1
        feat_type = "Unknown"
        if "Mons" in desc_text or "Mons" in name: 
            feat_type = "Mountain"
            importance = 4
        elif "Crater" in desc_text:
            feat_type = "Crater"
            importance = 2
        elif "Planitia" in desc_text:
            feat_type = "Plain"
            importance = 3

        features.append({
            "name": name,
            "type": feat_type,
            "lat": lat,
            "lon": lon,
            "importance": importance
        })

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(features, f, indent=2)
    print(f"Saved {len(features)} Mars landmarks to {output_path}")

if __name__ == "__main__":
    process_landmarks()

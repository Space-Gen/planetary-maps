import json
import requests

def process_landmarks():
    url = "https://planetarynames.wr.usgs.gov/data/moon_features.geojson"
    print(f"Fetching landmarks from {url}...")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return

    features = []
    for feature in data.get('features', []):
        props = feature.get('properties', {})
        coords = feature.get('geometry', {}).get('coordinates', [0, 0])
        
        # Clean and filter
        name = props.get('name')
        if not name:
            continue
            
        # Importance based on diameter or type
        diameter = props.get('diameter', 0)
        feat_type = props.get('type', 'Unknown')
        
        importance = 1
        if diameter > 100: importance = 3
        elif diameter > 50: importance = 2
        
        # Specific landing sites or major features
        if feat_type in ['Landing site', 'Mare']:
            importance = 4

        clean_feature = {
            "name": name,
            "type": feat_type,
            "lat": coords[1],
            "lon": coords[0],
            "diameter_km": diameter,
            "importance": importance
        }
        features.append(clean_feature)

    output_path = "moon/public/data/landmarks.json"
    with open(output_path, 'w') as f:
        json.dump(features, f, indent=2)
    print(f"Saved {len(features)} landmarks to {output_path}")

if __name__ == "__main__":
    process_landmarks()

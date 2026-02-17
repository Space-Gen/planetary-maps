# 🪐 Planetary Hub: Moon 3D Explorer

Welcome to the **Planetary Hub**. I am **Soumyadip Karforma (@soumyadipkarforma)**, and this is my specialized workspace for high-fidelity planetary data engineering and visualization.

This repository hosts a fully automated pipeline that builds a complete Cesium.js-based 3D Moon viewer. No local processing is allowed; every byte of data handling runs entirely inside GitHub Actions.

## 🌐 Connect with Me:
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/soumyadip_karforma) [![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/soumyadip_k) [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@soumyadip_karforma) [![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:soumyadipkarforma@gmail.com) 

## 💰 Support my work:
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/soumyadipkarforma) [![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/SoumyadipKarforma) 

---

## 🚀 Live Explorer
**[Launch Moon Hub 3D](https://space-gen.github.io/planetary-maps/moon/index.html)**

## 💻 Tech Stack (Planetary Hub):
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Bash Script](https://img.shields.io/badge/bash_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white) 

---

## 🛠 Project Highlights
- **Automated Pipeline**: Every 12 hours, GitHub Actions fetches the LOLA DEM (118m) and LROC WAC Mosaic (100m) from USGS/NASA servers.
- **Data Engineering**: Raw TIFFs are processed into Cesium quantized-mesh terrain and XYZ imagery tiles using Python, GDAL, and PROJ.
- **Landmark Extraction**: Over 9,000 IAU lunar features are extracted from KMZ nomenclature data and parsed into a lightweight JSON database.
- **3D Visualization**: A responsive Cesium.js application with Moon-specific ellipsoids, dynamic lighting, and integrated feature search.

## 📂 Architecture
- `moon/src/`: Core TypeScript logic for the viewer.
- `moon/scripts/`: Cloud-native Python tilers and parsers.
- `moon/public/`: Deployed assets and UI shell.
- `.github/workflows/`: The automation engine managing data sync and deployment.

## 📡 Data Credits
This project is powered by open data from:
- **NASA / LRO / LOLA / LROC**
- **USGS Astrogeology Science Center**
- **IAU Gazetteer of Planetary Nomenclature**

---
*Maintained with ❤️ by [Soumyadip Karforma](https://github.com/soumyadipkarforma)*  
[![](https://visitcount.itsvg.in/api?id=soumyadipkarforma&icon=6&color=0)](https://visitcount.itsvg.in)

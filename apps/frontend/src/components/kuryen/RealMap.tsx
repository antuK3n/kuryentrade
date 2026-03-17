"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 1. Recreate your v0 animated UI using Leaflet's HTML injection
const glowingZapIcon = L.divIcon({
  className: "bg-transparent border-none", // Removes Leaflet's default white square background
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center">
      <div class="absolute inset-0 rounded-full bg-[#00D084]/50 animate-ping"></div>
      
      <div class="relative w-full h-full rounded-full bg-[#00D084] flex items-center justify-center text-[#0c1411] shadow-[0_0_15px_rgba(0,208,132,0.8)] border border-[#1e332a]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16], // Perfectly centers the glowing icon on the coordinates
});

export default function RealMap({ markers, onMarkerClick }: any) {
  return (
    <MapContainer 
      center={[14.6042, 121.0103]} // Centered on Sta. Mesa
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      {/* Dark mode map tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      
      {/* Loop through your UI markers and place the custom glowing pins */}
      {markers.map((marker: any) => (
        <Marker 
          key={marker.id} 
          position={[marker.lat, marker.lng]}
          icon={glowingZapIcon} // 2. Apply the custom icon right here!
          eventHandlers={{
            click: () => onMarkerClick(marker), // Triggers your floating popup!
          }}
        />
      ))}
    </MapContainer>
  );
}
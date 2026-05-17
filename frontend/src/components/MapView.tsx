import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  locations: Location[];
  onMapClick: (lat: number, lng: number) => void;
  optimizedRoute: Location[];
  roadGeometry: [number, number][];
}

function ChangeMapView({ bounds }: { bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [bounds, map]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleBgClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleBgClick);
    return () => {
      map.off('click', handleBgClick);
    };
  }, [map, onMapClick]);
  return null;
}

export default function MapView({ locations, onMapClick, optimizedRoute, roadGeometry }: MapViewProps) {
  
  const createNumberedIcon = (label: string, isDepot: boolean) => {
    const bgColor = isDepot ? '#ef4444' : '#0f172a';
    return L.divIcon({
      html: `
        <div style="background: ${bgColor}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; border: 2px solid #ffffff; box-shadow: 0 4px 14px rgba(15,23,42,0.15);">
          ${label}
        </div>
      `,
      className: 'custom-gps-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <MapContainer center={[21.0285, 105.8542]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onMapClick={onMapClick} />
      {roadGeometry && roadGeometry.length > 0 && <ChangeMapView bounds={roadGeometry} />}
      
      {locations.map((loc, idx) => {
        const isDepot = idx === 0;
        const originalLabel = isDepot ? "KHO" : `${idx}`;
        let visitStep = -1;
        if (optimizedRoute.length > 0) {
          visitStep = optimizedRoute.findIndex(p => p.id === loc.id);
        }

        return (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={createNumberedIcon(originalLabel, isDepot)}>
            <Popup>
              <div style={{ fontFamily: 'system-ui', fontSize: '13px' }}>
                <strong style={{ color: isDepot ? '#ef4444' : '#2563eb' }}>
                  {isDepot ? "🏠 TỔNG KHO TRUNG TÂM" : `📦 ĐƠN HÀNG SỐ ${idx}`}
                </strong>
                {visitStep !== -1 && (
                  <div style={{ marginTop: '6px', padding: '4px 8px', backgroundColor: '#ecfdf5', color: '#047857', borderRadius: '6px', fontWeight: 700, fontSize: '11px' }}>
                    ➔ Thứ tự di chuyển: Bước {visitStep === 0 ? "Xuất phát" : visitStep}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {roadGeometry && roadGeometry.length > 0 && (
        <Polyline positions={roadGeometry} color="#2563eb" weight={6} opacity={0.85} lineJoin="round" lineCap="round" />
      )}
    </MapContainer>
  );
}
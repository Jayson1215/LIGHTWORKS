import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map click events
function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to recenter map when position changes
function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 15, { duration: 1 });
        }
    }, [lat, lng, map]);
    return null;
}

// Reverse geocode coordinates to address using OpenStreetMap Nominatim
async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        return data.display_name || '';
    } catch {
        return '';
    }
}

export default function LocationPicker({ address, latitude, longitude, onChange, label = 'Location', compact = false }) {
    const [detecting, setDetecting] = useState(false);
    const [geoError, setGeoError] = useState('');
    const mapRef = useRef(null);

    const defaultLat = 14.5995;  // Manila, Philippines
    const defaultLng = 120.9842;

    const lat = latitude || defaultLat;
    const lng = longitude || defaultLng;
    const hasPin = latitude && longitude;

    const handleDetect = () => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser');
            return;
        }
        setDetecting(true);
        setGeoError('');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                const addr = await reverseGeocode(lat, lng);
                onChange({ address: addr, latitude: lat, longitude: lng });
                setDetecting(false);
            },
            (err) => {
                setGeoError(
                    err.code === 1
                        ? 'Location access denied. Please allow location access or pin manually on the map.'
                        : 'Unable to detect location. Please pin manually on the map.'
                );
                setDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleMapClick = async (clickLat, clickLng) => {
        const addr = await reverseGeocode(clickLat, clickLng);
        onChange({ address: addr, latitude: clickLat, longitude: clickLng });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    <MapPin className="inline h-4 w-4 text-amber-600 mr-1 -mt-0.5" />
                    {label}
                </label>
                <button
                    type="button"
                    onClick={handleDetect}
                    disabled={detecting}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition disabled:opacity-50"
                >
                    {detecting ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Detecting...</>
                    ) : (
                        <><Navigation className="h-3.5 w-3.5" /> Detect My Location</>
                    )}
                </button>
            </div>

            {geoError && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{geoError}</p>
            )}

            {/* Address input */}
            <input
                type="text"
                value={address || ''}
                onChange={e => onChange({ address: e.target.value, latitude, longitude })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                placeholder="Enter your address or click the map to pin location"
            />

            {/* Map */}
            <div className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm ${compact ? 'h-48' : 'h-64'}`}>
                <MapContainer
                    center={[lat, lng]}
                    zoom={hasPin ? 15 : 6}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onLocationSelect={handleMapClick} />
                    <RecenterMap lat={hasPin ? latitude : null} lng={hasPin ? longitude : null} />
                    {hasPin && <Marker position={[latitude, longitude]} />}
                </MapContainer>
            </div>

            {hasPin && (
                <p className="text-xs text-gray-400">
                    📍 {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                </p>
            )}

            <p className="text-xs text-gray-400">Click on the map to pin your location, or use "Detect My Location"</p>
        </div>
    );
}

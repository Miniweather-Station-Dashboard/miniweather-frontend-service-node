"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { setActiveDeviceAsync } from "@/redux/slices/deviceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/helper";

// Remove the default Leaflet icon images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

const DEFAULT_CENTER = [-7.868215883075584, 110.34830342264677];

// Accepts either a JSON array ("[-7.7,110.3]") or a "lat, lng" string.
const parseLocation = (location) => {
  if (!location) return null;

  if (Array.isArray(location)) {
    const [lat, lng] = location.map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  }

  if (typeof location === "string") {
    try {
      const parsed = JSON.parse(location);
      if (Array.isArray(parsed)) {
        const [lat, lng] = parsed.map(Number);
        return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
      }
    } catch {
      // fall through to the "lat, lng" form
    }

    const parts = location.split(",").map((value) => parseFloat(value.trim()));
    if (parts.length === 2 && parts.every((value) => !Number.isNaN(value))) {
      return parts;
    }
  }

  return null;
};

const makeIcon = (active) =>
  L.divIcon({
    className: "",
    html: `<div class="pulse-marker${active ? " pulse-marker-active" : ""}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// Keeps every device marker inside the viewport.
function FitToDevices({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 13 });
  }, [map, positions]);

  return null;
}

export default function DeviceMap() {
  const deviceList = useAppSelector((state) => state.device.deviceList) || [];
  const activeDevice = useAppSelector((state) => state.device.activeDevice);
  const dispatch = useAppDispatch();

  const markers = useMemo(
    () =>
      deviceList
        .map((device) => ({ device, position: parseLocation(device.location) }))
        .filter((entry) => entry.position),
    [deviceList]
  );

  const positions = useMemo(
    () => markers.map((entry) => entry.position),
    [markers]
  );

  return (
    <div className="w-full h-[50vh] rounded-lg overflow-hidden">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FitToDevices positions={positions} />

        {markers.map(({ device, position }) => (
          <Marker
            key={device.id}
            position={position}
            icon={makeIcon(device.id === activeDevice?.id)}
            eventHandlers={{
              click: () => dispatch(setActiveDeviceAsync(device)),
            }}
          >
            <Popup>
              <strong>{device.name}</strong>
              <br />
              Status: {device.status}
              <br />
              Sensor count: {device.sensors?.length || 0}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

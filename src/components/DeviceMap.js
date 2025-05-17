"use client";

import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { setActiveDeviceAsync } from "@/redux/slices/deviceSlice";

// Remove the default Leaflet icon images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

export default function DeviceMap() {
  const deviceList = useSelector((state) => state.device.deviceList) || [];
  const dispatch = useDispatch();

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      <MapContainer
        center={[-7.868215883075584, 110.34830342264677]}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />

        {deviceList.map((device) => {
          let location;
          try {
            location = JSON.parse(device.location);
          } catch {
            return null;
          }

          const customIcon = L.divIcon({
            className: "",
            html: '<div class="pulse-marker"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          return (
            <Marker
              key={device.id}
              position={[location[0], location[1]]}
              icon={customIcon}
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
          );
        })}
      </MapContainer>
    </div>
  );
}

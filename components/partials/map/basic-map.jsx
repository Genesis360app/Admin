import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const BasicMap = () => {
  const position = [9.6000359, 7.9999721];
  return (
    <div className="w-full h-[300px]">
      <MapContainer
        center={position}
        zoom={8}
        maxZoom={18}
        minZoom={3}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="">
              A pretty CSS3 popup. <br /> Easily customizable.
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BasicMap;

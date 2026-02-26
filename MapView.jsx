import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";
import { getWeatherRisk } from "../services/weatherService";

// Fix default marker icon bug
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

// Example animated routes
const routes = [
  {
    id: "R1",
    path: [
      [28.6139, 77.2090], // Delhi
      [26.9124, 75.7873], // Jaipur
    ],
  },
  {
    id: "R2",
    path: [
      [19.076, 72.8777], // Mumbai
      [18.5204, 73.8567], // Pune
    ],
  },
];

function MapView() {
  const [weatherRisk, setWeatherRisk] = useState({
    level: "Loading...",
    condition: "",
  });

  // Fake truck movement
  const randomOffset = Math.random() * 1.5;

  const truckPosition = [
    19.076 + randomOffset,
    72.8777 + randomOffset,
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      const riskData = await getWeatherRisk(19.076, 72.8777);
      setWeatherRisk(riskData);
    };

    fetchWeather();
  }, []);

  // Dynamic colors
  const riskColor =
    weatherRisk.level === "HIGH"
      ? "red"
      : weatherRisk.level === "MEDIUM"
      ? "orange"
      : "green";

  const routeColor =
    weatherRisk.level === "HIGH"
      ? "red"
      : weatherRisk.level === "MEDIUM"
      ? "orange"
      : "cyan";

  return (
    <div className="mt-8 rounded-2xl z-[-1] overflow-hidden border border-slate-700 shadow-xl">

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Animated Routes */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: routeColor,
              weight: 5,
              dashArray: "6 12",
              opacity: 0.9,
            }}
            className="animate-route"
          />
        ))}

        {/* Moving Truck */}
        <Marker position={truckPosition}>
          <Popup>
            🚚 <b>Shipment SL-204</b> <br /><br />
            Weather: <b>{weatherRisk.condition}</b> <br />
            Risk Level:{" "}
            <b style={{ color: riskColor }}>
              {weatherRisk.level}
            </b>
          </Popup>
        </Marker>

        {/* Risk Zone */}
        <Circle
          center={[19.076, 72.8777]}
          radius={200000}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.25,
          }}
        />

      </MapContainer>
    </div>
  );
}

export default MapView;

const intermediateLocations = [
  [22.976875, 77.784538], // 1
  [22.69385, 78.156476], // 2
  [22.410825, 78.528414], // 3
  [22.1278, 78.900352], // 4
  [21.844775, 79.27229], // 5
  [21.56175, 79.644228], // 6
  [21.278725, 80.016166], // 7
  [20.9957, 80.388104], // 8
  [20.712675, 80.760042], // 9
  [20.42965, 81.13198], // 10
  [20.146625, 81.503918], // 11
  [19.8636, 81.875856], // 12
  [19.580575, 82.247794], // 13
  [19.29755, 82.619732], // 14
  [19.014525, 82.99167], //
];

import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import deliveryIconUrl from "../../asset/delivery.png";


const MapComponent = ({ origin, destination }) => {
  const mapContainerRef = useRef(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [map, setMap] = useState(null);
  const [deliveryVehicleMarker, setDeliveryVehicleMarker] = useState(null);
  const [popup, setPopup] = useState(null);
  const [prevOrigin, setPrevOrigin] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoibml0aXNoMDAiLCJhIjoiY2x4eHBmMngyMDNhYzJqc2J6NWd3cHAxciJ9.ZjbnHSqY9yLHr80nKkn80Q";

    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [origin[1], origin[0]],
        zoom: 12,
      });

      newMap.on("load", () => {
        const directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: "metric",
          profile: "mapbox/driving",
          interactive: false,
          controls: {
            instructions: false,
            inputs: false,
          },
          flyTo: false,
        });

        newMap.addControl(directions, "top-left");

        directions.setOrigin([origin[1], origin[0]]);
        directions.setDestination([destination[1], destination[0]]);

        directions.on("route", (e) => {
          if (e.route && e.route[0] && e.route[0].legs) {
            const { duration, distance } = e.route[0].legs.reduce(
              (acc, curr) => {
                acc.duration += curr.duration;
                acc.distance += curr.distance;
                return acc;
              },
              { duration: 0, distance: 0 }
            );

            const formattedTime = formatTime(duration);
            const formattedDistance = formatDistance(distance);

            setRouteSummary({
              duration: formattedTime,
              distance: formattedDistance,
            });
          }
        });

        const deliveryVehicleMarker = new mapboxgl.Marker({
          element: createMarkerElement(deliveryIconUrl),
          anchor: "top",
        })
          .setLngLat([origin[1], origin[0]])
          .addTo(newMap);

        setDeliveryVehicleMarker(deliveryVehicleMarker);

        // Create a default marker for the destination
        const destinationMarker = new mapboxgl.Marker({
          color: "#FF6347", // Set the marker color (orange)
        })
          .setLngLat([destination[1], destination[0]])
          .addTo(newMap);

        // Optionally, add a popup for the destination marker
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        })
          .setLngLat([destination[1], destination[0]])
          .addTo(newMap);

        setPopup(popup);
      });

      setMap(newMap);
    };

    let mapInstance = null;

    if (
      prevOrigin &&
      (prevOrigin[0] !== origin[0] || prevOrigin[1] !== origin[1])
    ) {
      if (map) {
        mapInstance = map;
        map.remove();
        setMap(null);
      }
      mapInstance = initializeMap();
    } else if (!map) {
      mapInstance = initializeMap();
    }

    setPrevOrigin(origin);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [origin]);

  const createMarkerElement = (iconUrl) => {
    const element = document.createElement("div");
    element.style.backgroundImage = `url(${iconUrl})`;
    element.style.width = "50px";
    element.style.height = "50px";
    element.style.backgroundSize = "cover";
    return element;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDistance = (meters) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(2)} km`;
  };

  return (
    <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
  );
};

export default MapComponent;

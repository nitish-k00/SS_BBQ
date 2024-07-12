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

  const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    mapboxgl.accessToken = token;

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

        const destinationMarker = new mapboxgl.Marker({
          color: "#FF6347", // Set the marker color (orange)
        })
          .setLngLat([destination[1], destination[0]])
          .addTo(newMap);
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

  const updateDeliveryVehicleMarker = (lngLat) => {
    if (deliveryVehicleMarker) {
      deliveryVehicleMarker.setLngLat(lngLat);
    }
  };

  const simulateDeliveryVehicleMovement = () => {
    const newLngLat = [origin[1], origin[0]];
    updateDeliveryVehicleMarker(newLngLat);
  };

  useEffect(() => {
    simulateDeliveryVehicleMovement();
  }, [origin]);

  const renderRouteSummary = () => {
    if (map && routeSummary && origin) {
      if (popup) {
        popup.remove();
      }

      const newPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat([origin[1], origin[0]])
        .setHTML(
          `<div><strong>Travel Time:</strong> ${routeSummary.duration}</div>
           <div><strong>Distance:</strong> ${routeSummary.distance}</div>`
        )
        .addTo(map);

      setPopup(newPopup);
    }
  };

  useEffect(() => {
    renderRouteSummary();
  }, [map, routeSummary, origin]);

  return (
    <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
  );
};

export default MapComponent;

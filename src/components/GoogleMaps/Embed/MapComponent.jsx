import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useRef, useState } from "react";

export default function MapComponent({ locations, height, zoom }) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const mapRef = useRef(null);
	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			locations.forEach((coord) => {
				bounds.extend(coord);
			});
			mapRef.current.fitBounds(bounds);
		}
	};

	// After the map has adjusted the bounds, check the zoom level
	const onIdle = () => {
		if (mapRef.current) {
			const currentZoom = mapRef.current.getZoom();
			console.log("Current Zoom: ", currentZoom);
			if (currentZoom > zoom) {
				mapRef.current.setZoom(zoom);
			}
		}
	};

	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds();
	};
	useEffect(() => {
		adjustBounds(); // Recenter and adjust zoom whenever coords change
	}, [locations]);
	return (
		locations.length > 0 && (
			<GoogleMap
				mapContainerStyle={mapStyles}
				// zoom={zoom || 12}
				onIdle={onIdle} // Listen for the idle event to check the zoom level
				// center={locations[locations.length - 1]}
				onLoad={onLoad}
				options={{ disableDefaultUI: true }}
			>
				{locations.map((location, index) => (
					<Marker key={index} position={location} />
				))}
			</GoogleMap>
		)
	);
}

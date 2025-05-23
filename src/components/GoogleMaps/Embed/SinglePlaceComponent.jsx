import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useRef, useState } from "react";

export default function SinglePlaceComponent({ place, height }) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const mapRef = useRef(null);

	// Adjust bounds based on the place viewport (with 'low' and 'high' for southwest and northeast)
	const adjustBounds = () => {
		if (mapRef.current && place?.viewport) {
			const bounds = new window.google.maps.LatLngBounds(
				new window.google.maps.LatLng(
					place.viewport.low.latitude,
					place.viewport.low.longitude
				), // southwest
				new window.google.maps.LatLng(
					place.viewport.high.latitude,
					place.viewport.high.longitude
				) // northeast
			);
			mapRef.current.fitBounds(bounds);
		}
	};

	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds(); // Fit the bounds once the map loads
	};

	useEffect(() => {
		adjustBounds(); // Recenter and adjust bounds whenever the place changes
	}, [place]);

	return (
		place &&
		(place.viewport ? (
			<GoogleMap
				mapContainerStyle={mapStyles}
				onLoad={onLoad}
				options={{ disableDefaultUI: true }}
			>
				<Marker
					position={{
						lat: place.location.latitude,
						lng: place.location.longitude,
					}}
				/>
			</GoogleMap>
		) : (
			<GoogleMap
				mapContainerStyle={mapStyles}
				zoom={16}
				center={{
					lat: place.location.latitude,
					lng: place.location.longitude,
				}}
			>
				<Marker
					position={{
						lat: place.location.latitude,
						lng: place.location.longitude,
					}}
				/>
			</GoogleMap>
		))
	);
}

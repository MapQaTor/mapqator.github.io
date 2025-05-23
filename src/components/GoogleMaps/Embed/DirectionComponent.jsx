import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	GoogleMap,
	LoadScript,
	Marker,
	DirectionsRenderer,
	DirectionsService,
	PolylineF,
} from "@react-google-maps/api";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

const POLYLINE_OPTIONS = {
	strokeColor: "#0F53FF",
	strokeOpacity: 0.9,
	strokeWeight: 5,
	clickable: true,
};

function decodePolyline(polylineStr) {
	let index = 0,
		lat = 0,
		lng = 0;
	const coordinates = [];
	const changes = { latitude: 0, longitude: 0 };

	while (index < polylineStr.length) {
		// Decode latitude and longitude alternately
		for (const unit of ["latitude", "longitude"]) {
			let shift = 0;
			let result = 0;

			while (index < polylineStr.length) {
				let byte = polylineStr.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
				if (byte < 0x20) break; // Break out of loop when byte is less than 0x20
			}

			changes[unit] = result & 1 ? ~(result >> 1) : result >> 1;
		}

		lat += changes.latitude;
		lng += changes.longitude;

		// Append the decoded lat/lng to the coordinates array
		coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
	}

	return coordinates;
}

export default function DirectionComponent({ height, zoom, polyline }) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const coords = useMemo(() => {
		if (polyline) {
			return decodePolyline(polyline);
		}
		return [];
	}, [polyline]);

	const [polylineOptions, setPolylineOptions] = useState(
		JSON.stringify(POLYLINE_OPTIONS)
	);

	const [mapCenter, setMapCenter] = useState(null);
	const [mapZoom, setMapZoom] = useState(zoom || 12);

	useEffect(() => {
		if (coords.length > 0) {
			// Calculate the bounding box using LatLngBounds
			const bounds = new window.google.maps.LatLngBounds();

			coords.forEach((coord) => bounds.extend(coord));

			// Get the center of the bounding box
			const center = bounds.getCenter();
			setMapCenter({ lat: center.lat(), lng: center.lng() });

			// You can also automatically adjust the zoom to fit the bounds
			// If you are controlling the map instance, you can use: map.fitBounds(bounds);
		}
	}, [coords]);

	const po = useMemo(() => {
		try {
			return JSON.parse(polylineOptions);
		} catch (e) {
			return POLYLINE_OPTIONS;
		}
	}, [polylineOptions]);
	const mapRef = useRef(null);
	const onLoad = (map) => {
		mapRef.current = map;

		// Create bounds object
		const bounds = new window.google.maps.LatLngBounds();
		coords.forEach((coord) => {
			bounds.extend(coord);
		});

		// Adjust the map to fit all coordinates
		map.fitBounds(bounds);
	};
	return (
		<GoogleMap
			mapContainerStyle={mapStyles}
			// zoom={mapZoom}
			// center={mapCenter}
			onLoad={onLoad}
			options={{ disableDefaultUI: true }}
		>
			<Marker position={coords[0]} />
			<Marker position={coords[coords.length - 1]} />
			<PolylineF path={coords} options={po} />
		</GoogleMap>
	);
}

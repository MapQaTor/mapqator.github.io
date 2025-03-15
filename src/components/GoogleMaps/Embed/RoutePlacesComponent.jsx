import {
	GoogleMap,
	LoadScript,
	Marker,
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

export default function RoutePlacesComponent({
	height,
	places,
	encodedPolyline,
	origin,
	destination,
}) {
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		const list = [];
		places.map((place) => {
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		setLocations(list);
	}, [places]);

	const coords = useMemo(() => {
		if (encodedPolyline) {
			return decodePolyline(encodedPolyline);
		}
		return [];
	}, [encodedPolyline]);

	console.log("destination: ", destination);
	console.log("RoutePlacesComponent: ", coords);

	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const mapRef = useRef(null);
	const [polylineOptions, setPolylineOptions] = useState(
		JSON.stringify(POLYLINE_OPTIONS)
	);

	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			locations.forEach((coord) => {
				bounds.extend(coord);
			});
			coords.forEach((coord) => {
				bounds.extend(coord);
			});

			if (origin)
				bounds.extend({
					lat: origin.location.latitude,
					lng: origin.location.longitude,
				});

			if (destination)
				bounds.extend({
					lat: destination.location.latitude,
					lng: destination.location.longitude,
				});

			mapRef.current.fitBounds(bounds);
		}
	};
	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds();
	};
	useEffect(() => {
		adjustBounds(); // Recenter and adjust zoom whenever coords change
	}, [locations, coords, origin, destination]);
	const po = useMemo(() => {
		try {
			return JSON.parse(polylineOptions);
		} catch (e) {
			return POLYLINE_OPTIONS;
		}
	}, [polylineOptions]);

	// Define the custom icon with the desired color
	const customIcon = {
		url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // URL to the custom icon
		scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
	};
	const blueIcon = {
		url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		scaledSize: new window.google.maps.Size(32, 32),
	};

	// Define predefined symbols
	const circleSymbol = {
		path: window.google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: "#0F53FF",
		fillOpacity: 0.8,
		strokeWeight: 2,
		strokeColor: "#0000FF",
	};

	const redCircleSymbol = {
		path: window.google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: "#EA4335",
		fillOpacity: 0.9,
		strokeWeight: 2,
		strokeColor: "#B41412",
	};

	return (
		<GoogleMap
			mapContainerStyle={mapStyles}
			// zoom={zoom || 12}
			// center={locations[locations.length - 1]}
			onLoad={onLoad}
			options={{ disableDefaultUI: true }}
		>
			{locations.map((location, index) => (
				<Marker key={index} position={location} />
			))}

			{(origin || coords.length > 0) && (
				<Marker
					position={
						coords.length > 0
							? coords[0]
							: {
									lat: origin.location.latitude,
									lng: origin.location.longitude,
							  }
					}
					icon={circleSymbol}
				/>
			)}

			{(destination || coords.length > 0) && (
				<Marker
					position={
						coords.length > 0
							? coords[coords.length - 1]
							: {
									lat: destination.location.latitude,
									lng: destination.location.longitude,
							  }
					}
					icon={redCircleSymbol}
				/>
			)}

			{coords.length > 0 && <PolylineF path={coords} options={po} />}
		</GoogleMap>
	);
}

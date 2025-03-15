import {
	faBicycle,
	faBiking,
	faBus,
	faCar,
	faMotorcycle,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function convertFromSnake(text) {
	return text
		.replace(/_/g, " ") // Replace underscores with spaces
		.split(" ") // Split the string into an array of words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(" ");
}

// export function convertTravelModeToLabel(mode) {
// 	return mode === "WALK"
// 		? "Walking"
// 		: mode === "DRIVE"
// 		? "Driving"
// 		: mode === "BICYCLE"
// 		? "Bicycling"
// 		: mode === "TRANSIT"
// 		? "Transit"
// 		: mode === "TWO_WHEELER"
// 		? "Two Wheeler"
// 		: "Unknown";
// }

// export function convertTravelModeToIcon(mode) {
// 	return mode === "WALK" ? (
// 		<FontAwesomeIcon icon={faWalking} />
// 	) : mode === "DRIVE" ? (
// 		<FontAwesomeIcon icon={faCar} />
// 	) : mode === "BICYCLE" ? (
// 		<FontAwesomeIcon icon={faBicycle} />
// 	) : mode === "TRANSIT" ? (
// 		<FontAwesomeIcon icon={faBus} />
// 	) : mode === "TWO_WHEELER" ? (
// 		<FontAwesomeIcon icon={faMotorcycle} />
// 	) : (
// 		""
// 	);
// }

export function decodePolyline(polylineStr) {
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

import { list as textSearchList } from "@/tools/TextSearch";
import { list as placeDetailsList } from "@/tools/PlaceDetails";
import { list as nearbySearchList } from "@/tools/NearbySearch";
import { list as computeRoutesList } from "@/tools/ComputeRoutes";
import { list as searchAlongRouteList } from "@/tools/SearchAlongRoute";

export function getToolOptions(mapService) {
	if (mapService === "all") {
		return {
			textSearch: Object.values(textSearchList)
				.map((family) => family)
				.flat(),
			placeDetails: Object.values(placeDetailsList)
				.map((family) => family)
				.flat(),
			nearbySearch: Object.values(nearbySearchList)
				.map((family) => family)
				.flat(),
			computeRoutes: Object.values(computeRoutesList)
				.map((family) => family)
				.flat(),
			searchAlongRoute: Object.values(searchAlongRouteList)
				.map((family) => family)
				.flat(),
		};
	} else {
		return {
			textSearch: textSearchList[mapService],
			placeDetails: placeDetailsList[mapService],
			nearbySearch: nearbySearchList[mapService],
			computeRoutes: computeRoutesList[mapService],
			searchAlongRoute: searchAlongRouteList[mapService],
		};
	}
}

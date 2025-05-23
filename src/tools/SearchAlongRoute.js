import Api from "@/api/base";
import config from "@/config/config";
import { decodePolyline } from "@/services/utils";

import GMTravelSelectionField, {
	convertTravelModeToIcon as convertTravelModeToIconGM,
	convertTravelModeToLabel as convertTravelModeToLabelGM,
} from "@/mapServices/GoogleMaps/TravelSelectionField";

import GMAvoidSelectionField from "@/mapServices/GoogleMaps/AvoidSelectionField";

import TTTravelSelectionField, {
	convertTravelModeToIcon as convertTravelModeToIconTT,
	convertTravelModeToLabel as convertTravelModeToLabelTT,
} from "@/mapServices/TomTom/TravelSelectionField";
import TTAvoidSelectionField from "@/mapServices/TomTom/AvoidSelectionField";

import TypeSelectionField, {
	formatType,
} from "@/mapServices/GoogleMaps/TypeSelectionField";

import CategorySelectionField, {
	formatCategory,
} from "@/mapServices/TomTom/CategorySelectionField";

// SearchAlongRoute(origin, destination, travelMode, routeModifiers, type, rankPreference, minRating, priceLevels, maxResultCount)
class SearchAlongRoute extends Api {
	constructor() {
		if (new.target === SearchAlongRoute) {
			throw new TypeError(
				"Cannot construct SearchAlongRoute instances directly"
			);
		}
		super();
	}

	convertRouteRequest = (params) => {
		throw new Error("Method 'convertRouteRequest()' must be implemented.");
	};

	convertNearbyRequest = (params, routeResponse) => {
		throw new Error("Method 'convertNearbyRequest()' must be implemented.");
	};

	convertRouteResponse = (data) => {
		throw new Error("Method 'convertRouteResponse()' must be implemented.");
	};

	convertNearbyResponse = (data) => {
		throw new Error(
			"Method 'convertNearbyResponse()' must be implemented."
		);
	};

	run = async (params) => {
		// Find Route
		const startTime1 = performance.now(); // Record the start time
		const adaptedRouteRequest = this.convertRouteRequest(params);
		const routeResponse = await this.post(
			"/map/cached",
			adaptedRouteRequest
		);
		if (!routeResponse.success) return { success: false };

		const epochId = Date.now();
		const adaptedRouteResponse = this.convertRouteResponse(
			routeResponse.data
		);

		if (params.type === "") {
			return {
				success: true,
				data: {
					route_response: adaptedRouteResponse,
					apiCallLogs: [
						{
							...adaptedRouteRequest,
							uuid: epochId,
							responseTime: performance.now() - startTime1,
							// result: routeResponse.data,
						},
					],
					uuid: epochId,
				},
			};
		}
		const responseTime1 = performance.now() - startTime1;
		const startTime2 = performance.now(); // Record the start time
		// Find Nearby Places along Route
		const adaptedNearbyRequest = this.convertNearbyRequest(
			params,
			adaptedRouteResponse.routes[0].polyline.encodedPolyline
		);
		const nearbyResponse = await this.post(
			"/map/cached",
			adaptedNearbyRequest
		);
		if (!nearbyResponse.success) return { success: false };

		const adaptedNearbyResponse = this.convertNearbyResponse(
			nearbyResponse.data
		);
		return {
			success: true,
			data: {
				route_response: adaptedRouteResponse,
				nearby_response: adaptedNearbyResponse,
				apiCallLogs: [
					{
						...adaptedRouteRequest,
						uuid: epochId,
						responseTime: responseTime1,
						// result: routeResponse.data,
					},
					{
						...adaptedNearbyRequest,
						uuid: epochId,
						responseTime: performance.now() - startTime2,
						// result: nearbyResponse.data,
					},
				],
				uuid: epochId,
			},
		};
	};
}

export default SearchAlongRoute;

class GoogleRoutesApi extends SearchAlongRoute {
	constructor() {
		super();
		this.family = "googleMaps";
	}

	convertRouteRequest = (params) => {
		return {
			url: "https://routes.googleapis.com/directions/v2:computeRoutes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"routes.distanceMeters,routes.staticDuration,routes.description,routes.localizedValues,routes.optimized_intermediate_waypoint_index,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails,routes.legs.localizedValues,routes.legs.steps.travelMode,routes.legs.steps.localizedValues,routes.legs.polyline,routes.polyline",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			data: {
				origin: {
					location: {
						latLng: params.origin.location,
					},
				},
				destination: {
					location: {
						latLng: params.destination.location,
					},
				},
				travelMode: params.travelMode,
				intermediates: undefined,
				routeModifiers: {
					avoidTolls: ["DRIVE", "TWO_WHEELER"].includes(
						params.travelMode
					)
						? params.routeModifiers.avoidTolls
						: false,
					avoidHighways: ["DRIVE", "TWO_WHEELER"].includes(
						params.travelMode
					)
						? params.routeModifiers.avoidHighways
						: false,
					avoidFerries: ["DRIVE", "TWO_WHEELER"].includes(
						params.travelMode
					)
						? params.routeModifiers.avoidFerries
						: false,
					avoidIndoor: false,
				},
				transitPreferences: undefined,
				optimizeWaypointOrder: false,
				extraComputations:
					params.travelMode === "TRANSIT"
						? []
						: ["HTML_FORMATTED_NAVIGATION_INSTRUCTIONS"],
				units: "METRIC",
				languageCode: "en",
				routingPreference:
					params.travelMode === "WALK" ||
					params.travelMode === "BICYCLE" ||
					params.travelMode === "TRANSIT"
						? undefined
						: "TRAFFIC_UNAWARE",
				computeAlternativeRoutes: false,
			},
		};
	};

	convertNearbyRequest = (params, encodedPolyline) => {
		return {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			data: {
				textQuery:
					params.searchBy === "type" ? params.type : params.keyword,
				rankPreference: params.rankPreference || "RELEVANCE", // DISTANCE/RELEVANCE/RANK_PREFERENCE_UNSPECIFIED
				includedType:
					params.searchBy === "type" ? params.type : undefined, // One type only
				minRating: params.minRating,
				priceLevels: params.priceLevels,
				maxResultCount: params.maxResultCount || 5,
				strictTypeFiltering: true,
				searchAlongRouteParameters: {
					polyline: {
						encodedPolyline: encodedPolyline,
					},
				},
				languageCode: "en",
			},
		};
	};

	convertRouteResponse = (data) => {
		return data;
	};

	convertNearbyResponse = (data) => {
		return data;
	};

	TravelSelectionField = GMTravelSelectionField;
	convertTravelModeToIcon = convertTravelModeToIconGM;
	convertTravelModeToLabel = convertTravelModeToLabelGM;
	AvoidSelectionField = GMAvoidSelectionField;
	PoiCategorySelectionField = TypeSelectionField;
	formatPoiCategory = formatType;

	allowedParams = {
		rankPreference: true,
		minRating: true,
		priceLevels: true,
		maxResultCount: true,
	};
	// run = async (params) => {
	// 	const apiCall1 = {
	// 		url: "https://routes.googleapis.com/directions/v2:computeRoutes",
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"X-Goog-FieldMask":
	// 				"routes.distanceMeters,routes.staticDuration,routes.description,routes.localizedValues,routes.optimized_intermediate_waypoint_index,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails,routes.legs.localizedValues,routes.legs.steps.travelMode,routes.legs.steps.localizedValues,routes.legs.polyline,routes.polyline",
	// 			"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
	// 		},
	// 		data: {
	// 			origin: {
	// 				location: {
	// 					latlng: params.origin.location,
	// 				},
	// 			},
	// 			destination: {
	// 				location: {
	// 					latlng: params.destination.location,
	// 				},
	// 			},
	// 			travelMode: params.travelMode,
	// 			intermediates: undefined,
	// 			routeModifiers: {
	// 				avoidTolls: ["DRIVE", "TWO_WHEELER"].includes(
	// 					params.travelMode
	// 				)
	// 					? params.routeModifiers.avoidTolls
	// 					: false,
	// 				avoidHighways: ["DRIVE", "TWO_WHEELER"].includes(
	// 					params.travelMode
	// 				)
	// 					? params.routeModifiers.avoidHighways
	// 					: false,
	// 				avoidFerries: ["DRIVE", "TWO_WHEELER"].includes(
	// 					params.travelMode
	// 				)
	// 					? params.routeModifiers.avoidFerries
	// 					: false,
	// 				avoidIndoor: false,
	// 			},
	// 			transitPreferences: undefined,
	// 			optimizeWaypointOrder: false,
	// 			extraComputations:
	// 				params.travelMode === "TRANSIT"
	// 					? []
	// 					: ["HTML_FORMATTED_NAVIGATION_INSTRUCTIONS"],
	// 			units: "METRIC",
	// 			languageCode: "en",
	// 			routingPreference:
	// 				params.travelMode === "WALK" ||
	// 				params.travelMode === "BICYCLE" ||
	// 				params.travelMode === "TRANSIT"
	// 					? undefined
	// 					: "TRAFFIC_UNAWARE",
	// 			computeAlternativeRoutes: false,
	// 		},
	// 	};

	// 	const response1 = await this.post("/map/cached", apiCall1);

	// 	if (!response1.success) return { success: false };
	// 	const apiCall2 = {
	// 		url: "https://places.googleapis.com/v1/places:searchText",
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"X-Goog-FieldMask":
	// 				"places.id,places.displayName,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location",
	// 		},
	// 		data: {
	// 			textQuery:
	// 				params.searchBy === "type" ? params.type : params.keyword,
	// 			rankPreference: params.rankPreference || "RELEVANCE", // DISTANCE/RELEVANCE/RANK_PREFERENCE_UNSPECIFIED
	// 			includedType:
	// 				params.searchBy === "type" ? params.type : undefined, // One type only
	// 			minRating: params.minRating,
	// 			priceLevels: params.priceLevels,
	// 			maxResultCount: params.maxResultCount || 5,
	// 			strictTypeFiltering: true,
	// 			searchAlongRouteParameters: {
	// 				polyline: {
	// 					encodedPolyline:
	// 						response1.data.routes[0].polyline.encodedPolyline,
	// 				},
	// 			},
	// 			languageCode: "en",
	// 		},
	// 	};

	// 	const response2 = await this.post("/map/cached", apiCall2);

	// 	if (!response2.success) return { success: false };

	// 	const epochId = Date.now();

	// 	return {
	// 		success: true,
	// 		data: {
	// 			route_response: response1.data,
	// 			nearby_response: response2.data,
	// 			apiCallLogs: [
	// 				{
	// 					...apiCall1,
	// 					uuid: epochId,
	// 					result: response1.data,
	// 				},
	// 				{
	// 					...apiCall2,
	// 					uuid: epochId,
	// 					result: response2.data,
	// 				},
	// 			],
	// 			uuid: epochId,
	// 		},
	// 	};
	// };
}

class TomTomApi extends SearchAlongRoute {
	constructor() {
		super();
		this.family = "tomtom";
	}

	convertRouteRequest = (params) => {
		const avoidOptions = [];
		if (params.routeModifiers.avoidTolls) avoidOptions.push("tollRoads");
		if (params.routeModifiers.avoidMotorways)
			avoidOptions.push("motorways");
		if (params.routeModifiers.avoidFerries) avoidOptions.push("ferries");
		if (params.routeModifiers.avoidUnpaved)
			avoidOptions.push("unpavedRoads");
		if (params.routeModifiers.avoidCarPools) avoidOptions.push("carpools");
		if (params.routeModifiers.avoidAlreadyUsed)
			avoidOptions.push("alreadyUsedRoads");
		return {
			url:
				"https://api.tomtom.com/routing/1/calculateRoute/" +
				params.origin.location.latitude +
				"," +
				params.origin.location.longitude +
				":" +
				params.destination.location.latitude +
				"," +
				params.destination.location.longitude +
				"/json?" +
				"language=" +
				"en-US" +
				"&key=" +
				"key:TOMTOM_API_KEY" +
				"&travelMode=" +
				params.travelMode +
				"&routeType=" +
				"fastest" +
				"&traffic=" +
				false +
				(avoidOptions.length > 0
					? "&avoid=" + avoidOptions.join("&avoid=")
					: "") +
				"&instructionsType=" +
				"text" +
				"&maxAlternatives=0" +
				"&routeRepresentation=" +
				"encodedPolyline" +
				"&computeTravelTimeFor=" +
				"all",
			method: "GET",
		};
	};

	convertRouteResponse = (data) => {
		const routes = data.routes.map((route) => {
			return {
				legs: route.legs.map((leg, index) => {
					return {
						polyline: {
							encodedPolyline: leg.encodedPolyline,
						},
					};
				}),
				polyline: {
					encodedPolyline: route.legs[0].encodedPolyline,
				},
			};
		});

		console.log("ROUTES:", routes);
		return { routes };
	};

	convertNearbyRequest = (params, encodedPolyline) => {
		return {
			url:
				"https://api.tomtom.com/search/2/searchAlongRoute/" +
				this.formatPoiCategory(params.type) +
				".json",
			method: "POST",
			params: {
				key: "key:TOMTOM_API_KEY",
				lat: params.lat,
				lon: params.lng,
				limit: params.maxResultCount || 5,
				categorySet: params.type,
				maxDetourTime: 0,
			},
			data: {
				route: {
					points: decodePolyline(encodedPolyline).map((point) => ({
						lat: point.lat,
						lon: point.lng,
					})),
				},
			},
		};
	};

	convertNearbyResponse = (data) => {
		const places = data.results.map((place) => ({
			id: place.id,
			displayName: {
				text: place.poi.name,
			},
			formattedAddress: place.address.freeformAddress,
			shortFormattedAddress: place.address.freeformAddress,
			location: {
				latitude: place.position.lat,
				longitude: place.position.lon,
			},
		}));
		return { places };
	};

	TravelSelectionField = TTTravelSelectionField;
	convertTravelModeToIcon = convertTravelModeToIconTT;
	convertTravelModeToLabel = convertTravelModeToLabelTT;
	AvoidSelectionField = TTAvoidSelectionField;

	PoiCategorySelectionField = CategorySelectionField;
	formatPoiCategory = formatCategory;

	allowedParams = {
		rankPreference: false,
		minRating: false,
		priceLevels: false,
		maxResultCount: true,
		radius: false,
	};
}

export const list = {
	googleMaps: [
		{
			name: "Google Maps API (New)",
			icon: config.baseUrl + "/images/google-maps.png",
			instance: new GoogleRoutesApi(),
		},
	],

	tomtom: [
		{
			name: "TomTom API",
			icon: config.baseUrl + "/images/tomtom.png",
			instance: new TomTomApi(),
		},
	],
};

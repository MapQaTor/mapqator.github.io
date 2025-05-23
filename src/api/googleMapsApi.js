import MapsApi from "./mapsApi";

class GoogleMapsApi extends MapsApi {
	textSearch = async (query) => {
		const apiCall = {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.shortFormattedAddress,places.location",
				//  "X-Goog-Api-Key": ************************,
			},
			body: {
				textQuery: query,
				maxResultCount: 5,
			},
		};
		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			return {
				success: true,
				data: {
					result: response.data,
					apiCallLogs: [
						{
							...apiCall,
							uuid: epochId,
							result: response.data,
						},
					],
					uuid: epochId,
				},
			};
		}
		return {
			success: false,
		};
	};

	placeDetails = async (place_id) => {
		const apiCall = {
			url: "https://places.googleapis.com/v1/places/" + place_id,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"id,addressComponents,adrFormatAddress,formattedAddress,location,shortFormattedAddress,types,viewport,accessibilityOptions,businessStatus,displayName,googleMapsUri,primaryType,primaryTypeDisplayName,internationalPhoneNumber,nationalPhoneNumber,priceLevel,rating,regularOpeningHours.weekdayDescriptions,userRatingCount,websiteUri,allowsDogs,curbsidePickup,delivery,dineIn,goodForChildren,goodForGroups,goodForWatchingSports,liveMusic,menuForChildren,outdoorSeating,reservable,restroom,servesBeer,servesBreakfast,servesBrunch,servesCocktails,servesCoffee,servesDessert,servesDinner,servesLunch,servesVegetarianFood,servesWine,takeout",
				//  "X-Goog-Api-Key": ************************,
			},
		};
		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			return {
				success: true,
				data: {
					result: response.data,
					apiCallLogs: [
						{
							...apiCall,
							uuid: epochId,
							result: response.data,
						},
					],
					uuid: epochId,
				},
			};
		}
		return {
			success: false,
		};
	};

	nearbySearch = async (params) => {
		const apiCall = {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location,routingSummaries",
				//  "X-Goog-Api-Key": ************************,
			},
			body: {
				textQuery: params.type + " " + params.keyword,
				rankPreference: params.rankPreference || "RELEVANCE", // DISTANCE/RELEVANCE/RANK_PREFERENCE_UNSPECIFIED
				includedType: params.type, // One type only
				minRating: params.minRating,
				priceLevels: params.priceLevels,
				maxResultCount: params.maxResultCount || 5,
				strictTypeFiltering: true,
				locationBias: {
					circle: {
						center: {
							latitude: params.lat,
							longitude: params.lng,
						},
						radius: 0,
					},
				},
				languageCode: "en",
				routingParameters: {
					origin: {
						latitude: params.lat,
						longitude: params.lng,
					},
					travelMode: "WALK",
				},
			},
		};
		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			return {
				success: true,
				data: {
					result: response.data,
					apiCallLogs: [
						{
							...apiCall,
							uuid: epochId,
							result: response.data,
						},
					],
					uuid: epochId,
				},
			};
		}
		return {
			success: false,
		};
	};

	computeRoutes = async (params) => {
		const apiCall = {
			url: "https://routes.googleapis.com/directions/v2:computeRoutes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"routes.distanceMeters,routes.staticDuration,routes.description,routes.localizedValues,routes.optimized_intermediate_waypoint_index,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails,routes.legs.localizedValues,routes.legs.steps.travelMode,routes.legs.steps.localizedValues,routes.legs.polyline,routes.polyline",
				//  "X-Goog-Api-Key": ************************,
			},
			body: {
				origin: {
					placeId: params.origin,
				},
				destination: {
					placeId: params.destination,
				},
				travelMode: params.travelMode,
				intermediates:
					params.travelMode !== "TRANSIT"
						? params.intermediates?.map((intermediate) => ({
								placeId: intermediate,
						  }))
						: undefined,
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
				transitPreferences:
					params.travelMode === "TRANSIT"
						? params.transitPreferences
						: undefined,
				optimizeWaypointOrder:
					params.intermediates.length > 0 &&
					params.travelMode !== "TRANSIT"
						? params.optimizeWaypointOrder
						: false,
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
				computeAlternativeRoutes:
					params.intermediates.length === 0
						? params.computeAlternativeRoutes === undefined
							? true
							: params.computeAlternativeRoutes
						: false,
			},
		};

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			return {
				success: true,
				data: {
					result: response.data,
					apiCallLogs: [
						{
							...apiCall,
							uuid: epochId,
							result: response.data,
						},
					],
					uuid: epochId,
				},
			};
		}

		return {
			success: false,
		};
	};

	searchAlongRoute = async (params) => {
		const apiCall1 = {
			url: "https://routes.googleapis.com/directions/v2:computeRoutes",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"routes.distanceMeters,routes.staticDuration,routes.description,routes.localizedValues,routes.optimized_intermediate_waypoint_index,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails,routes.legs.localizedValues,routes.legs.steps.travelMode,routes.legs.steps.localizedValues,routes.legs.polyline,routes.polyline",
				//  "X-Goog-Api-Key": ************************,
			},
			body: {
				origin: {
					placeId: params.origin,
				},
				destination: {
					placeId: params.destination,
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

		const response1 = await this.post("/map/cached", apiCall1);

		if (!response1.success) return { success: false };
		const apiCall2 = {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location",
			},
			body: {
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
						encodedPolyline:
							response1.data.routes[0].polyline.encodedPolyline,
					},
				},
				languageCode: "en",
			},
		};

		const response2 = await this.post("/map/cached", apiCall2);

		if (!response2.success) return { success: false };

		const epochId = Date.now();

		return {
			success: true,
			data: {
				route_response: response1.data,
				nearby_response: response2.data,
				apiCallLogs: [
					{
						...apiCall1,
						uuid: epochId,
						result: response1.data,
					},
					{
						...apiCall2,
						uuid: epochId,
						result: response2.data,
					},
				],
				uuid: epochId,
			},
		};
	};
}
const mapsApi = new GoogleMapsApi();
export default mapsApi;

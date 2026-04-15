import Api from "@/api/base";
import config from "@/config/config";
import TypeSelectionField, {
	formatType,
} from "@/mapServices/GoogleMaps/TypeSelectionField";

import CategorySelectionField, {
	formatCategory,
} from "@/mapServices/TomTom/CategorySelectionField";

// NearbySearch(lat, lng, type, minRating, priceLevels, rankPreference, maxResultCount)
class NearbySearch extends Api {
	constructor() {
		if (new.target === NearbySearch) {
			throw new TypeError(
				"Cannot construct NearbySearch instances directly"
			);
		}
		super();
	}

	convertRequest = (query) => {
		throw new Error("Method 'convertRequest()' must be implemented.");
	};

	convertResponse = (data) => {
		throw new Error("Method 'convertResponse()' must be implemented.");
	};

	fetch = async (params) => {
		const startTime = performance.now(); // Record the start time
		const adaptedRequest = this.convertRequest(params);

		const epochId = Date.now(); // Unique ID for this tool call
		const response = await this.post("/map/cached", adaptedRequest);

		if (response.success) {
			const adaptedResponse = this.convertResponse(response.data);
			return {
				success: true,
				data: {
					result: adaptedResponse,
					apiCallLogs: [
						{
							...adaptedRequest,
							uuid: epochId,
							responseTime: performance.now() - startTime,
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

	PoiCategorySelectionField = null;
	formatPoiCategory = null;
	allowedParams = {
		rankPreference: true,
		minRating: true,
		priceLevels: true,
		maxResultCount: true,
	};
}

export default NearbySearch;

class GooglePlacesApiNew extends NearbySearch {
	constructor() {
		super();
		this.family = "googleMaps";
	}

	convertRequest = (params) => {
		return {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location,routingSummaries",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			data: {
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
	};

	convertResponse = (data) => {
		return data;
	};

	// run = async (params) => {
	// 	const apiCall = {
	// 		url: "https://places.googleapis.com/v1/places:searchText",
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"X-Goog-FieldMask":
	// 				"places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.shortFormattedAddress,places.userRatingCount,places.location,routingSummaries",
	// 			"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
	// 		},
	// 		data: {
	// 			textQuery: params.type + " " + params.keyword,
	// 			rankPreference: params.rankPreference || "RELEVANCE", // DISTANCE/RELEVANCE/RANK_PREFERENCE_UNSPECIFIED
	// 			includedType: params.type, // One type only
	// 			minRating: params.minRating,
	// 			priceLevels: params.priceLevels,
	// 			maxResultCount: params.maxResultCount || 5,
	// 			strictTypeFiltering: true,
	// 			locationBias: {
	// 				circle: {
	// 					center: {
	// 						latitude: params.lat,
	// 						longitude: params.lng,
	// 					},
	// 					radius: 0,
	// 				},
	// 			},
	// 			languageCode: "en",
	// 			routingParameters: {
	// 				origin: {
	// 					latitude: params.lat,
	// 					longitude: params.lng,
	// 				},
	// 				travelMode: "WALK",
	// 			},
	// 		},
	// 	};
	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: response.data,
	// 				apiCallLogs: [
	// 					{
	// 						...apiCall,
	// 						uuid: epochId,
	// 						result: response.data,
	// 					},
	// 				],
	// 				uuid: epochId,
	// 			},
	// 		};
	// 	}
	// 	return {
	// 		success: false,
	// 	};
	// };

	PoiCategorySelectionField = TypeSelectionField;
	formatPoiCategory = formatType;

	allowedParams = {
		rankPreference: true,
		minRating: true,
		priceLevels: true,
		maxResultCount: true,
		radius: false,
	};
}

class TomTomApi extends NearbySearch {
	constructor() {
		super();
		this.family = "tomtom";
	}

	convertRequest = (params) => {
		return {
			url: "https://api.tomtom.com/search/2/nearbySearch/.json",
			method: "GET",
			params: {
				key: "key:TOMTOM_API_KEY",
				query: params.type,
				lat: params.lat,
				lon: params.lng,
				limit: params.maxResultCount || 5,
				categorySet: params.type,
				radius: params.radius === 0 ? undefined : params.radius,
			},
		};
	};

	convertResponse = (data) => {
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

	// run = async (params) => {
	// 	const apiCall = {
	// 		url: "https://api.tomtom.com/search/2/nearbySearch/.json",
	// 		method: "GET",
	// 		params: {
	// 			key: "key:TOMTOM_API_KEY",
	// 			query: params.keyword,
	// 			lat: params.lat,
	// 			lon: params.lng,
	// 			limit: params.maxResultCount || 5,
	// 			categorySet: params.type,
	// 			radius: params.radius === 0 ? undefined : params.radius,
	// 		},
	// 	};
	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	console.log("Tom Tom:", response);
	// 	if (response.success) {
	// 		const places = response.data.results.map((place) => ({
	// 			id: place.id,
	// 			displayName: {
	// 				text: place.poi.name,
	// 			},
	// 			formattedAddress: place.address.freeformAddress,
	// 			shortFormattedAddress: place.address.freeformAddress,
	// 			location: {
	// 				latitude: place.position.lat,
	// 				longitude: place.position.lon,
	// 			},
	// 		}));
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: { places },
	// 				apiCallLogs: [
	// 					{
	// 						...apiCall,
	// 						uuid: epochId,
	// 						result: response.data,
	// 					},
	// 				],
	// 				uuid: epochId,
	// 			},
	// 		};
	// 	}
	// 	return {
	// 		success: false,
	// 	};
	// };

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
			instance: new GooglePlacesApiNew(),
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

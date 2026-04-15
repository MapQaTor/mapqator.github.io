import Api from "@/api/base";
import { head } from "lodash";
import config from "@/config/config";

// TextSearch(query)
class TextSearch extends Api {
	constructor() {
		if (new.target === TextSearch) {
			throw new TypeError(
				"Cannot construct TextSearch instances directly"
			);
		}
		super();
	}

	/**
	 * Convert the query to the format required by the API
	 *
	 * @param {string} query - The query string
	 */
	convertRequest = (query) => {
		throw new Error("Method 'convertRequest()' must be implemented.");
	};

	/**
	 *
	 * @param {Object} data - The response data from the API
	 *
	 * @returns {Object} - The formatted response data
	 *
	 * @example
	 *
	 * return {
	 *  places: [
	 *  {
	 *  	id: 1,
	 * 		displayName: { text: "Dhaka" },
	 *  	shortFormattedAddress: "Dhaka, Bangladesh",
	 *  	location: {
	 * 			latitude: 23.8103,
	 * 			longitude: 90.4125,
	 * 		},
	 *  },
	 *  { ... }
	 * ],
	 * };
	 */
	convertResponse = (data) => {
		throw new Error("Method 'convertResponse()' must be implemented.");
	};

	suggest = async (query) => {
		const startTime = performance.now(); // Record the start time
		const adaptedRequest = this.convertRequest(query);
		const epochId = Date.now();
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
	};

	retrieve = async (place) => {
		return {
			success: true,
			data: {
				result: place,
				apiCallLogs: [],
				uuid: place.uuid,
			},
		};
	};

	getLocation = async (place) => {
		throw new Error("Method 'getLocation()' must be implemented.");
	};
}

class GooglePlacesApiNew extends TextSearch {
	constructor() {
		super();
		this.family = "googleMaps";
	}

	convertRequest = (query) => {
		return {
			url: "https://places.googleapis.com/v1/places:searchText",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"places.id,places.displayName,places.shortFormattedAddress,places.location",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
			data: {
				textQuery: query,
				maxResultCount: 5,
			},
		};
	};

	convertResponse = (data) => {
		const places = data.places.map((place) => ({
			id: place.id,
			displayName: {
				text: place.displayName.text,
			},
			shortFormattedAddress: place.shortFormattedAddress,
			location: {
				latitude: place.location.latitude,
				longitude: place.location.longitude,
			},
		}));
		return { places };
	};

	// run = async (query) => {
	// 	const apiCall = {
	// 		url: "https://places.googleapis.com/v1/places:searchText",
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"X-Goog-FieldMask":
	// 				"places.id,places.displayName,places.shortFormattedAddress,places.location",
	// 			"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
	// 		},
	// 		data: {
	// 			textQuery: query,
	// 			maxResultCount: 5,
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
}

class GooglePlacesApi extends TextSearch {
	constructor() {
		super();
		this.family = "googleMaps";
	}

	convertRequest = (query) => {
		return {
			url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
			method: "GET",
			params: {
				query: query,
				key: "key:GOOGLE_MAPS_API_KEY",
				language: "en",
			},
		};
	};

	convertResponse = (data) => {
		const places = data.results.map((place) => ({
			id: place.place_id,
			displayName: {
				text: place.name,
			},
			shortFormattedAddress: place.formatted_address,
			location: {
				latitude: place.geometry.location.lat,
				longitude: place.geometry.location.lng,
			},
		}));
		return { places };
	};

	// run = async (query) => {
	// 	const apiCall = {
	// 		url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
	// 		method: "GET",
	// 		params: {
	// 			query: query,
	// 			key: "key:GOOGLE_MAPS_API_KEY",
	// 			language: "en",
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const places = response.data.results.map((place) => ({
	// 			id: place.place_id,
	// 			displayName: {
	// 				text: place.name,
	// 			},
	// 			shortFormattedAddress: place.formatted_address,
	// 			location: {
	// 				latitude: place.geometry.location.lat,
	// 				longitude: place.geometry.location.lng,
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
}

class NominatimApi extends TextSearch {
	constructor() {
		super();
		this.family = "openStreetMap";
	}

	convertRequest = (query) => {
		return {
			url: "https://nominatim.openstreetmap.org/search",
			method: "GET",
			headers: {
				"Accept-Language": "en",
				"User-Agent": "MapQaTor/1.0 (mahirlabibdihan@gmail.com)",
			},
			params: {
				q: query,
				format: "jsonv2",
				limit: 5,
			},
		};
	};

	convertResponse = (data) => {
		const places = data.map((place) => ({
			id: place.place_id,
			displayName: {
				text: place.name,
			},
			shortFormattedAddress: place.display_name,
			location: {
				latitude: parseFloat(place.lat),
				longitude: parseFloat(place.lon),
			},
		}));
		return { places };
	};
}
// run = async (query) => {
// 	const apiCall = {
// 		url: "https://nominatim.openstreetmap.org/search",
// 		method: "GET",
// 		headers: {
// 			"Accept-Language": "en", // Add this header to request response in English
// 		},
// 		params: {
// 			q: query,
// 			format: "jsonv2",
// 			limit: 5,
// 		},
// 	};

// 	const epochId = Date.now(); // Unique ID for this tool call
// 	const response = await this.post("/map/cached", apiCall);

// 	if (response.success) {
// 		const places = response.data.map((place) => ({
// 			id: place.place_id,
// 			displayName: {
// 				text: place.name,
// 			},
// 			shortFormattedAddress: place.display_name,
// 			location: {
// 				latitude: parseFloat(place.lat),
// 				longitude: parseFloat(place.lon),
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

class MapBoxApi extends TextSearch {
	constructor() {
		super();
		this.family = "mapbox";
	}

	convertRequest = (query) => {
		return {
			url: "https://api.mapbox.com/search/searchbox/v1/suggest",
			method: "GET",
			params: {
				q: query,
				access_token: "key:MAPBOX_ACCESS_TOKEN",
				session_token: "key:MAPBOX_SESSION_TOKEN",
				limit: 5,
			},
		};
	};

	convertResponse = (data) => {
		const places = data.suggestions.map((place) => ({
			id: place.mapbox_id,
			displayName: {
				text: place.name,
			},
			shortFormattedAddress: place.full_address,
		}));
		return { places };
	};

	// run = async (query) => {
	// 	const apiCall = {
	// 		url: "https://api.mapbox.com/search/searchbox/v1/suggest",
	// 		method: "GET",
	// 		params: {
	// 			q: query,
	// 			access_token: "key:MAPBOX_ACCESS_TOKEN",
	// 			session_token: "key:MAPBOX_SESSION_TOKEN",
	// 			limit: 5,
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const places = response.data.suggestions.map((place) => ({
	// 			id: place.mapbox_id,
	// 			displayName: {
	// 				text: place.name,
	// 			},
	// 			shortFormattedAddress: place.full_address,
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

	retrieve = async (place) => {
		const startTime = performance.now(); // Record the start time
		const apiCall = {
			url:
				"https://api.mapbox.com/search/searchbox/v1/retrieve/" +
				place.id,
			method: "GET",
			params: {
				access_token: "key:MAPBOX_ACCESS_TOKEN",
				session_token: "key:MAPBOX_SESSION_TOKEN",
			},
		};

		const epochId = place.uuid; // Unique ID for this tool call
		const response = await this.post("/map/cached", apiCall);

		if (response.success) {
			const location = {
				latitude:
					response.data.features[0].properties.coordinates.latitude,
				longitude:
					response.data.features[0].properties.coordinates.longitude,
			};
			return {
				success: true,
				data: {
					result: { ...place, location },
					apiCallLogs: [
						{
							...apiCall,
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
}

class TomTomApi extends TextSearch {
	constructor() {
		super();
		this.family = "tomtom";
	}

	convertRequest = (query) => {
		return {
			url: "https://api.tomtom.com/search/2/poiSearch/" + query + ".json",
			method: "GET",
			params: {
				key: "key:TOMTOM_API_KEY",
				limit: 5,
				language: "en-US",
			},
		};
	};

	convertResponse = (data) => {
		const places = data.results.map((place) => ({
			id: place.id,
			displayName: {
				text: place.poi.name,
			},
			shortFormattedAddress: place.address.freeformAddress,
			location: {
				latitude: place.position.lat,
				longitude: place.position.lon,
			},
		}));
		return { places };
	};
}

class HereApi extends TextSearch {
	constructor() {
		super();
		this.family = "here";
	}

	convertRequest = (query) => {
		return {
			url: "https://discover.search.hereapi.com/v1/discover",
			method: "GET",
			params: {
				apikey: "key:HERE_API_KEY",
				at: "23.75628863547386,90.38468295345672", // Choose your location
				q: query,
				lang: "en-US",
				limit: 5,
			},
		};
	};

	convertResponse = (data) => {
		const places = data.items.map((place) => ({
			id: place.id,
			displayName: {
				text: place.title,
			},
			shortFormattedAddress: place.address.label,
			location: {
				latitude: place.position.lat,
				longitude: place.position.lng,
			},
		}));
		return { places };
	};

	// run = async (query) => {
	// 	const apiCall = {
	// 		url: "https://discover.search.hereapi.com/v1/discover",
	// 		method: "GET",
	// 		params: {
	// 			apikey: "key:HERE_API_KEY",
	// 			at: "23.75628863547386,90.38468295345672",
	// 			q: query,
	// 			lang: "en-US",
	// 			limit: 5,
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const places = response.data.items.map((place) => ({
	// 			id: place.id,
	// 			displayName: {
	// 				text: place.title,
	// 			},
	// 			shortFormattedAddress: place.address.label,
	// 			location: {
	// 				latitude: place.position.lat,
	// 				longitude: place.position.lng,
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
}

class AzureMapsApi extends TextSearch {
	constructor() {
		super();
		this.family = "azureMaps";
	}

	convertRequest = (query) => {
		return {
			url: "https://atlas.microsoft.com/search/fuzzy/json",
			method: "GET",
			params: {
				"api-version": "1.0",
				query: query,
				"subscription-key": "key:AZURE_MAPS_API_KEY",
				limit: 5,
			},
			headers: {
				"Accept-Language": "en", // Add this header to request response in English
			},
		};
	};

	convertResponse = (data) => {
		const places = data.results.map((place) => ({
			id: place.id,
			displayName: {
				text: place.poi.name,
			},
			shortFormattedAddress: place.address.freeformAddress,
			location: {
				latitude: place.position.lat,
				longitude: place.position.lon,
			},
			internationalPhoneNumber: place.poi.phone,
			website: place.poi.url,
			types: place.poi.categories,
			viewport: {
				low: {
					latitude: place.viewport.topLeftPoint.lat,
					longitude: place.viewport.topLeftPoint.lon,
				},
				high: {
					latitude: place.viewport.btmRightPoint.lat,
					longitude: place.viewport.btmRightPoint.lon,
				},
			},
		}));

		return { places };
	};

	// run = async (query) => {
	// 	const apiCall = {
	// 		url: "https://atlas.microsoft.com/search/fuzzy/json",
	// 		method: "GET",
	// 		params: {
	// 			"api-version": "1.0",
	// 			query: query,
	// 			"subscription-key": "key:AZURE_MAPS_API_KEY",
	// 			limit: 5,
	// 		},
	// 		headers: {
	// 			"Accept-Language": "en", // Add this header to request response in English
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const places = response.data.results.map((place) => ({
	// 			id: place.id,
	// 			displayName: {
	// 				text: place.poi.name,
	// 			},
	// 			shortFormattedAddress: place.address.freeformAddress,
	// 			location: {
	// 				latitude: place.position.lat,
	// 				longitude: place.position.lon,
	// 			},
	// 			internationalPhoneNumber: place.poi.phone,
	// 			website: place.poi.url,
	// 			types: place.poi.categories,
	// 			viewport: {
	// 				low: {
	// 					latitude: place.viewport.topLeftPoint.lat,
	// 					longitude: place.viewport.topLeftPoint.lon,
	// 				},
	// 				high: {
	// 					latitude: place.viewport.btmRightPoint.lat,
	// 					longitude: place.viewport.btmRightPoint.lon,
	// 				},
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
}

export const list = {
	googleMaps: [
		{
			name: "Google Maps API (New)",
			icon: config.baseUrl + "/images/google-maps.png",
			instance: new GooglePlacesApiNew(),
		},
		{
			name: "Google Maps API",
			icon: config.baseUrl + "/images/google-maps.png",
			instance: new GooglePlacesApi(),
		},
	],
	openStreetMap: [
		{
			name: "Nominatim API",
			icon: config.baseUrl + "/images/openstreetmap.logo.png",
			instance: new NominatimApi(),
		},
	],
	mapbox: [
		{
			name: "Mapbox API",
			icon: config.baseUrl + "/images/mapbox.png",
			instance: new MapBoxApi(),
		},
	],
	tomtom: [
		{
			name: "TomTom API",
			icon: config.baseUrl + "/images/tomtom.png",
			instance: new TomTomApi(),
		},
	],
	here: [
		{
			name: "HERE API",
			icon: config.baseUrl + "/images/here.png",
			instance: new HereApi(),
		},
	],

	azureMaps: [
		{
			name: "Azure Maps API",
			icon: config.baseUrl + "/images/azure-maps.png",
			instance: new AzureMapsApi(),
		},
	],
};

export default TextSearch;

import Api from "@/api/base";
import config from "@/config/config";

// PlaceDetails(place: Places from TextSearch or NearbySearch or SearchAlongRoute)
class PlaceDetails extends Api {
	constructor() {
		if (new.target === PlaceDetails) {
			throw new TypeError(
				"Cannot construct PlaceDetails instances directly"
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

	fetch = async (place) => {
		const startTime = performance.now(); // Record the start time
		const adaptedRequest = this.convertRequest(place);
		const epochId = Date.now(); // Unique ID for this tool call

		if (adaptedRequest) {
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
		} else {
			const adaptedResponse = this.convertResponse(place);
			return {
				success: true,
				data: {
					result: adaptedResponse,
					apiCallLogs: [],
					uuid: epochId,
				},
			};
		}
	};

	getFields = () => {
		throw new Error("Method 'getFields()' must be implemented.");
		return [
			"location",
			"shortFormattedAddress",
			"accessibilityOptions",
			"businessStatus",
			"googleMapsUri",
			"primaryType",
			"internationalPhoneNumber",
			"nationalPhoneNumber",
			"priceLevel",
			"rating",
			"regularOpeningHours",
			"userRatingCount",
			"websiteUri",
			"allowsDogs",
			"curbsidePickup",
			"delivery",
			"dineIn",
			"editorialSummary",
			"evChargeOptions",
			"fuelOptions",
			"goodForChildren",
			"goodForGroups",
			"goodForWatchingSports",
			"liveMusic",
			"menuForChildren",
			"parkingOptions",
			"paymentOptions",
			"outdoorSeating",
			"reservable",
			"restroom",
			"servesBeer",
			"servesBreakfast",
			"servesBrunch",
			"servesCocktails",
			"servesCoffee",
			"servesDessert",
			"servesDinner",
			"servesLunch",
			"servesVegetarianFood",
			"servesWine",
			"takeout",
			"generativeSummary",
			"areaSummary",
		];
	};
}

export default PlaceDetails;

class GooglePlacesApiNew extends PlaceDetails {
	constructor() {
		super();
		this.family = "googleMaps";
	}

	convertRequest = (place) => {
		return {
			url: "https://places.googleapis.com/v1/places/" + place.id,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-FieldMask":
					"id,addressComponents,adrFormatAddress,formattedAddress,location,shortFormattedAddress,types,viewport,accessibilityOptions,businessStatus,displayName,googleMapsUri,primaryType,primaryTypeDisplayName,internationalPhoneNumber,nationalPhoneNumber,priceLevel,rating,regularOpeningHours.weekdayDescriptions,userRatingCount,websiteUri,allowsDogs,curbsidePickup,delivery,dineIn,goodForChildren,goodForGroups,goodForWatchingSports,liveMusic,menuForChildren,outdoorSeating,reservable,restroom,servesBeer,servesBreakfast,servesBrunch,servesCocktails,servesCoffee,servesDessert,servesDinner,servesLunch,servesVegetarianFood,servesWine,takeout",
				"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
			},
		};
	};

	convertResponse = (data) => {
		return data;
	};

	// run = async (place) => {
	// 	const place_id = place.id;
	// 	const apiCall = {
	// 		url: "https://places.googleapis.com/v1/places/" + place_id,
	// 		method: "GET",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"X-Goog-FieldMask":
	// 				"id,addressComponents,adrFormatAddress,formattedAddress,location,shortFormattedAddress,types,viewport,accessibilityOptions,businessStatus,displayName,googleMapsUri,primaryType,primaryTypeDisplayName,internationalPhoneNumber,nationalPhoneNumber,priceLevel,rating,regularOpeningHours.weekdayDescriptions,userRatingCount,websiteUri,allowsDogs,curbsidePickup,delivery,dineIn,goodForChildren,goodForGroups,goodForWatchingSports,liveMusic,menuForChildren,outdoorSeating,reservable,restroom,servesBeer,servesBreakfast,servesBrunch,servesCocktails,servesCoffee,servesDessert,servesDinner,servesLunch,servesVegetarianFood,servesWine,takeout",
	// 			"X-Goog-Api-Key": "key:GOOGLE_MAPS_API_KEY",
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"accessibilityOptions",
			"businessStatus",
			"googleMapsUri",
			"primaryType",
			"internationalPhoneNumber",
			"nationalPhoneNumber",
			"priceLevel",
			"rating",
			"regularOpeningHours",
			"userRatingCount",
			"websiteUri",
			"allowsDogs",
			"curbsidePickup",
			"delivery",
			"dineIn",
			"editorialSummary",
			"evChargeOptions",
			"fuelOptions",
			"goodForChildren",
			"goodForGroups",
			"goodForWatchingSports",
			"liveMusic",
			"menuForChildren",
			"parkingOptions",
			"paymentOptions",
			"outdoorSeating",
			"reservable",
			"restroom",
			"servesBeer",
			"servesBreakfast",
			"servesBrunch",
			"servesCocktails",
			"servesCoffee",
			"servesDessert",
			"servesDinner",
			"servesLunch",
			"servesVegetarianFood",
			"servesWine",
			"takeout",
		];
	};
}

class NominatimApi extends PlaceDetails {
	constructor() {
		super();
		this.family = "openStreetMap";
	}

	convertRequest = (place) => {
		return {
			url: "https://nominatim.openstreetmap.org/details",
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept-Language": "en",
			},
			params: {
				// osmtype: "W",
				format: "json",
				place_id: place.id,
				// format: "json",
			},
		};
	};

	convertResponse = (data) => {
		const details = {
			id: data.place_id,
			displayName: {
				text: data.names["name:en"],
			},
			location: {
				latitude: data.geometry.coordinates[1],
				longitude: data.geometry.coordinates[0],
			},
			regularOpeningHours: {
				weekdayDescriptions: data.extratags.opening_hours,
			},
			internationalPhoneNumber: data.extratags["contact:phone"],
			accessibilityOptions: {
				wheelchairAccessibleEntrance:
					data.extratags.wheelchair === "yes",
			},
			primaryType: data.type,
			websiteUri: data.extratags["contact:website"],
		};
		return details;
	};

	// run = async (place) => {
	// 	const place_id = place.id;
	// 	const apiCall = {
	// 		url: "https://nominatim.openstreetmap.org/details",
	// 		method: "GET",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"Accept-Language": "en",
	// 		},
	// 		params: {
	// 			// osmtype: "W",
	// 			format: "json",
	// 			place_id: place_id,
	// 			// format: "json",
	// 		},
	// 	};
	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const details = {
	// 			id: response.data.place_id,
	// 			displayName: {
	// 				text: response.data.names["name:en"],
	// 			},
	// 			location: {
	// 				latitude: response.data.geometry.coordinates[1],
	// 				longitude: response.data.geometry.coordinates[0],
	// 			},
	// 			regularOpeningHours: {
	// 				weekdayDescriptions: response.data.extratags.opening_hours,
	// 			},
	// 			internationalPhoneNumber:
	// 				response.data.extratags["contact:phone"],
	// 			accessibilityOptions: {
	// 				wheelchairAccessibleEntrance:
	// 					response.data.extratags.wheelchair === "yes",
	// 			},
	// 			primaryType: response.data.type,
	// 			websiteUri: response.data.extratags["contact:website"],
	// 		};
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: details,
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"accessibilityOptions",
			"primaryType",
			"internationalPhoneNumber",
			"regularOpeningHours",
			"websiteUri",
		];
	};
}

class MapBoxApi extends PlaceDetails {
	constructor() {
		super();
		this.family = "mapbox";
	}

	convertRequest = (place) => {
		return {
			url:
				"https://api.mapbox.com/search/searchbox/v1/retrieve/" +
				place.id,
			method: "GET",
			params: {
				access_token: "key:MAPBOX_ACCESS_TOKEN",
				session_token: "key:MAPBOX_SESSION_TOKEN",
			},
		};
	};

	convertResponse = (data) => {
		const e = data.features[0].properties;
		const details = {
			id: e.mapbox_id,
			displayName: {
				text: e.name,
			},
			shortFormattedAddress: e.full_address,
			location: {
				latitude: e.coordinates.latitude,
				longitude: e.coordinates.longitude,
			},
			types: e.poi_category_ids,
			accessibilityOptions: {
				wheelchairAccessibleEntrance: e.metadata.wheelchair_accessible,
			},
		};
		return details;
	};

	// run = async (place) => {
	// 	const place_id = place.id;
	// 	const apiCall = {
	// 		url:
	// 			"https://api.mapbox.com/search/searchbox/v1/retrieve/" +
	// 			place_id,
	// 		method: "GET",
	// 		params: {
	// 			access_token: "key:MAPBOX_ACCESS_TOKEN",
	// 			session_token: "key:MAPBOX_SESSION_TOKEN",
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const e = response.data.features[0].properties;
	// 		const details = {
	// 			id: e.mapbox_id,
	// 			displayName: {
	// 				text: e.name,
	// 			},
	// 			shortFormattedAddress: e.full_address,
	// 			location: {
	// 				latitude: e.coordinates.latitude,
	// 				longitude: e.coordinates.longitude,
	// 			},
	// 			types: e.poi_category_ids,
	// 			accessibilityOptions: {
	// 				wheelchairAccessibleEntrance:
	// 					e.metadata.wheelchair_accessible,
	// 			},
	// 		};
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: details,
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

	getFields = () => {
		return ["location", "shortFormattedAddress", "accessibilityOptions"];
	};
}

class TomTomApi extends PlaceDetails {
	constructor() {
		super();
		this.family = "tomtom";
	}

	convertRequest = (place) => {
		return {
			url: "https://api.tomtom.com/search/2/place.json",
			method: "GET",
			params: {
				key: "key:TOMTOM_API_KEY",
				entityId: place.id,
				language: "en-US",
			},
		};
	};

	convertResponse = (data) => {
		const e = data.results[0];
		const details = {
			id: e.id,
			displayName: {
				text: e.poi.name,
			},
			internationalPhoneNumber: e.poi.phone,
			websiteUri: e.poi.url,
			shortFormattedAddress: e.address.freeformAddress,
			location: {
				latitude: e.position.lat,
				longitude: e.position.lon,
			},
			viewport: {
				low: {
					latitude: e.viewport.topLeftPoint.lat,
					longitude: e.viewport.topLeftPoint.lon,
				},
				high: {
					latitude: e.viewport.btmRightPoint.lat,
					longitude: e.viewport.btmRightPoint.lon,
				},
			},
		};
		return details;
	};

	// run = async (place) => {
	// 	const place_id = place.id;
	// 	const apiCall = {
	// 		url: "https://api.tomtom.com/search/2/place.json",
	// 		method: "GET",
	// 		params: {
	// 			key: "key:TOMTOM_API_KEY",
	// 			entityId: place_id,
	// 			language: "en-US",
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const e = response.data.results[0];
	// 		const details = {
	// 			id: e.id,
	// 			displayName: {
	// 				text: e.poi.name,
	// 			},
	// 			internationalPhoneNumber: e.poi.phone,
	// 			websiteUri: e.poi.url,
	// 			shortFormattedAddress: e.address.freeformAddress,
	// 			location: {
	// 				latitude: e.position.lat,
	// 				longitude: e.position.lon,
	// 			},
	// 			viewport: {
	// 				low: {
	// 					latitude: e.viewport.topLeftPoint.lat,
	// 					longitude: e.viewport.topLeftPoint.lon,
	// 				},
	// 				high: {
	// 					latitude: e.viewport.btmRightPoint.lat,
	// 					longitude: e.viewport.btmRightPoint.lon,
	// 				},
	// 			},
	// 		};
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: details,
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"internationalPhoneNumber",
			"websiteUri",
		];
	};
}

class HereApi extends PlaceDetails {
	constructor() {
		super();
		this.family = "here";
	}

	convertRequest = (place) => {
		return {
			url: "https://lookup.search.hereapi.com/v1/lookup",
			method: "GET",
			params: {
				id: place.id,
				apikey: "key:HERE_API_KEY",
				lang: "en-US",
			},
		};
	};

	convertResponse = (data) => {
		const e = data;
		const details = {
			id: e.id,
			displayName: {
				text: e.title,
			},
			shortFormattedAddress: e.address.label,
			location: {
				latitude: e.position.lat,
				longitude: e.position.lng,
			},
			internationalPhoneNumber: e.contacts[0].phone[0].value,
			websiteUri: e.contacts[0].www[0].value,
		};
		return details;
	};

	// run = async (place) => {
	// 	const place_id = place.id;
	// 	const apiCall = {
	// 		url: "https://lookup.search.hereapi.com/v1/lookup",
	// 		method: "GET",
	// 		params: {
	// 			id: place_id,
	// 			apikey: "key:HERE_API_KEY",
	// 			lang: "en-US",
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const e = response.data;
	// 		const details = {
	// 			id: e.id,
	// 			displayName: {
	// 				text: e.title,
	// 			},
	// 			shortFormattedAddress: e.address.label,
	// 			location: {
	// 				latitude: e.position.lat,
	// 				longitude: e.position.lng,
	// 			},
	// 			internationalPhoneNumber: e.contacts[0].phone[0].value,
	// 			websiteUri: e.contacts[0].www[0].value,
	// 		};
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: details,
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

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"internationalPhoneNumber",
			"websiteUri",
		];
	};
}

class AzureMapsApi extends PlaceDetails {
	constructor() {
		super();
		this.family = "azureMaps";
	}

	convertRequest = (place) => {
		return null;
	};

	convertResponse = (data) => {
		const place = data;
		const details = {
			id: place.id,
			displayName: place.displayName,
			shortFormattedAddress: place.shortFormattedAddress,
			location: place.location,
			internationalPhoneNumber: place.internationalPhoneNumber,
			websiteUri: place.websiteUri,
			viewport: place.viewport,
			types: place.types,
		};
		return details;
	};

	// run = async (place) => {
	// 	if (place) {
	// 		const epochId = place.uuid;
	// 		const details = {
	// 			id: place.id,
	// 			displayName: place.displayName,
	// 			shortFormattedAddress: place.shortFormattedAddress,
	// 			location: place.location,
	// 			internationalPhoneNumber: place.internationalPhoneNumber,
	// 			websiteUri: place.websiteUri,
	// 			viewport: place.viewport,
	// 			types: place.types,
	// 		};
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: details,
	// 				apiCallLogs: [],
	// 				uuid: epochId,
	// 			},
	// 		};
	// 	}
	// 	return {
	// 		success: false,
	// 	};
	// };

	getFields = () => {
		return [
			"location",
			"shortFormattedAddress",
			"internationalPhoneNumber",
			"websiteUri",
		];
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

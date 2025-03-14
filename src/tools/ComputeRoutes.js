import Api from "@/api/base";
import { distance } from "framer-motion";
import config from "@/config/config";
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

import OSMTravelSelectionField, {
	convertTravelModeToIcon as convertTravelModeToIconOSM,
	convertTravelModeToLabel as convertTravelModeToLabelOSM,
} from "@/mapServices/OpenStreetMap/TravelSelectionField";
import OSMAvoidSelectionField from "@/mapServices/OpenStreetMap/AvoidSelectionField";

// ComputeRoutes(origin, destination, travelMode, routeModifiers, computeAlternativeRoutes, intermediates, optimizeWaypointOrder)
class ComputeRoutes extends Api {
	constructor() {
		if (new.target === ComputeRoutes) {
			throw new TypeError(
				"Cannot construct ComputeRoutes instances directly"
			);
		}
		super();
	}

	run = async (params) => {
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
}

export default ComputeRoutes;

class GoogleRoutesApi extends ComputeRoutes {
	constructor() {
		super();
		this.family = "googleMaps";
	}

	convertRequest = (params) => {
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
				intermediates:
					params.travelMode !== "TRANSIT"
						? params.intermediates?.map((intermediate) => ({
								location: {
									latLng: intermediate.location,
								},
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
					params.intermediates?.length > 1 &&
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
					params.intermediates?.length === 0
						? params.computeAlternativeRoutes
						: false,
			},
		};
	};

	convertResponse = (data) => {
		return data;
	};

	// run = async (params) => {
	// 	const apiCall = {
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
	// 					latLng: params.origin.location,
	// 				},
	// 			},
	// 			destination: {
	// 				location: {
	// 					latLng: params.destination.location,
	// 				},
	// 			},
	// 			travelMode: params.travelMode,
	// 			intermediates:
	// 				params.travelMode !== "TRANSIT"
	// 					? params.intermediates?.map((intermediate) => ({
	// 							location: {
	// 								latLng: intermediate.location,
	// 							},
	// 					  }))
	// 					: undefined,
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
	// 			transitPreferences:
	// 				params.travelMode === "TRANSIT"
	// 					? params.transitPreferences
	// 					: undefined,
	// 			optimizeWaypointOrder:
	// 				params.intermediates.length > 1 &&
	// 				params.travelMode !== "TRANSIT"
	// 					? params.optimizeWaypointOrder
	// 					: false,
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
	// 			computeAlternativeRoutes:
	// 				params.intermediates.length === 0
	// 					? params.computeAlternativeRoutes === undefined
	// 						? true
	// 						: params.computeAlternativeRoutes
	// 					: false,
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

	allowedTravelModes = ["DRIVE", "BICYCLE", "TWO_WHEELER", "WALK"];
	allowedParams = {
		intermediates: true,
		routeModifiers: true,
		computeAlternativeRoutes: true,
		optimizeWaypointOrder: true,
	};

	TravelSelectionField = GMTravelSelectionField;
	convertTravelModeToIcon = convertTravelModeToIconGM;
	convertTravelModeToLabel = convertTravelModeToLabelGM;
	AvoidSelectionField = GMAvoidSelectionField;
}

// [car, car_delivery, car_avoid_ferry, car_avoid_motorway, car_avoid_toll, truck, small_truck, small_truck_delivery, scooter, scooter_delivery, bike, mtb, racingbike, foot, hike, as_the_crow_flies]
function formatDuration(milliseconds) {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	let result = "";
	if (hours > 0) {
		result += `${hours} hours `;
	}
	if (minutes > 0) {
		result += `${minutes} mins`;
	}
	if (result === "") {
		result = `${totalSeconds} seconds
		`;
	}
	return result.trim();
}

function formatDistance(meters) {
	if (meters < 1000) {
		return `${meters} m`;
	}
	const kilometers = meters / 1000;
	return `${kilometers} km`;
}

class GraphHopperApi extends ComputeRoutes {
	constructor() {
		super();
		this.family = "openStreetMap";
	}

	convertRequest = (params) => {
		return {
			url: "https://graphhopper.com/api/1/route",
			method: "POST",
			data: {
				points: [
					[
						params.origin.location.longitude,
						params.origin.location.latitude,
					],
					// Add intermediate points
					...params.intermediates.map((intermediate) => [
						intermediate.location.longitude,
						intermediate.location.latitude,
					]),
					[
						params.destination.location.longitude,
						params.destination.location.latitude,
					],
				],
				vehicle: params.travelMode,
				locale: "en",
				instructions: true,
				points_encoded: true,
				weighting: "fastest",
				avoid: params.routeModifiers.avoidTolls
					? "toll"
					: params.routeModifiers.avoidHighways
					? "motorway"
					: params.routeModifiers.avoidFerries
					? "ferry"
					: undefined,
				algorithm:
					params.intermediates.length === 0 &&
					params.computeAlternativeRoutes
						? "alternative_route"
						: undefined,
				alternative_route: {
					max_paths:
						params.intermediates.length === 0 &&
						params.computeAlternativeRoutes
							? 3
							: 1,
				},
				optimize:
					params.intermediates.length > 1
						? params.optimizeWaypointOrder
						: false,
			},
			params: {
				key: "key:GRAPHHOPPER_API_KEY",
			},
		};
	};

	convertResponse = (data) => {
		const routes = data.paths.map((path) => {
			return {
				legs: [
					{
						// description: path.instructions,
						// legs: path.points.coordinates.map((point) => {
						// 	return {
						// 		polyline: point,
						// 	};
						// }),
						steps: path.instructions.map((instruction) => {
							return {
								navigationInstruction: {
									instructions: instruction.text,
								},
								// travelMode: instruction.type,
								localizedValues: {
									distance: {
										text: formatDistance(
											instruction.distance
										),
									},
									staticDuration: {
										text: formatDuration(instruction.time),
									},
								},
							};
						}),
						polyline: {
							encodedPolyline: path.points,
						},
						localizedValues: {
							distance: {
								text: formatDistance(path.distance),
							},
							staticDuration: {
								text: formatDuration(path.time),
							},
						},
					},
				],
				distanceMeters: path.distance,
				staticDuration: `${Math.round(path.time / 1000)}s`,
				polyline: {
					encodedPolyline: path.points,
				},
				localizedValues: {
					distance: {
						text: formatDistance(path.distance),
					},
					staticDuration: {
						text: formatDuration(path.time),
					},
				},
			};
		});
		return { routes };
	};

	// run = async (params) => {
	// 	console.log("GraphHopper API");
	// 	const apiCall = {
	// 		url: "https://graphhopper.com/api/1/route",
	// 		method: "POST",
	// 		data: {
	// 			points: [
	// 				[
	// 					params.origin.location.longitude,
	// 					params.origin.location.latitude,
	// 				],
	// 				// Add intermediate points
	// 				...params.intermediates.map((intermediate) => [
	// 					intermediate.location.longitude,
	// 					intermediate.location.latitude,
	// 				]),
	// 				[
	// 					params.destination.location.longitude,
	// 					params.destination.location.latitude,
	// 				],
	// 			],
	// 			vehicle:
	// 				params.travelMode == "DRIVE"
	// 					? params.routeModifiers.avoidTolls
	// 						? "car_avoid_toll"
	// 						: params.routeModifiers.avoidFerries
	// 						? "car_avoid_ferry"
	// 						: params.routeModifiers.avoidHighways
	// 						? "car_avoid_motorway"
	// 						: "car"
	// 					: params.travelMode == "BICYCLE"
	// 					? "bike"
	// 					: params.travelMode == "TWO_WHEELER"
	// 					? "scooter"
	// 					: "foot",
	// 			locale: "en",
	// 			instructions: true,
	// 			points_encoded: true,
	// 			weighting: "fastest",
	// 			avoid: params.routeModifiers.avoidTolls
	// 				? "toll"
	// 				: params.routeModifiers.avoidHighways
	// 				? "motorway"
	// 				: params.routeModifiers.avoidFerries
	// 				? "ferry"
	// 				: undefined,
	// 			algorithm:
	// 				params.intermediates.length === 0 &&
	// 				params.computeAlternativeRoutes
	// 					? "alternative_route"
	// 					: undefined,
	// 			alternative_route: {
	// 				max_paths:
	// 					params.intermediates.length === 0 &&
	// 					params.computeAlternativeRoutes
	// 						? 3
	// 						: 1,
	// 			},
	// 			optimize:
	// 				params.intermediates.length > 1
	// 					? params.optimizeWaypointOrder
	// 					: false,
	// 		},
	// 		params: {
	// 			key: "key:GRAPHHOPPER_API_KEY",
	// 		},
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	if (response.success) {
	// 		const routes = response.data.paths.map((path) => {
	// 			return {
	// 				legs: [
	// 					{
	// 						// description: path.instructions,
	// 						// legs: path.points.coordinates.map((point) => {
	// 						// 	return {
	// 						// 		polyline: point,
	// 						// 	};
	// 						// }),
	// 						steps: path.instructions.map((instruction) => {
	// 							return {
	// 								navigationInstruction: {
	// 									instructions: instruction.text,
	// 								},
	// 								// travelMode: instruction.type,
	// 								localizedValues: {
	// 									distance: {
	// 										text: formatDistance(
	// 											instruction.distance
	// 										),
	// 									},
	// 									staticDuration: {
	// 										text: formatDuration(
	// 											instruction.time
	// 										),
	// 									},
	// 								},
	// 							};
	// 						}),
	// 						polyline: {
	// 							encodedPolyline: path.points,
	// 						},
	// 						localizedValues: {
	// 							distance: {
	// 								text: formatDistance(path.distance),
	// 							},
	// 							staticDuration: {
	// 								text: formatDuration(path.time),
	// 							},
	// 						},
	// 					},
	// 				],
	// 				distanceMeters: path.distance,
	// 				staticDuration: `${Math.round(path.time / 1000)}s`,
	// 				polyline: {
	// 					encodedPolyline: path.points,
	// 				},
	// 				localizedValues: {
	// 					distance: {
	// 						text: formatDistance(path.distance),
	// 					},
	// 					staticDuration: {
	// 						text: formatDuration(path.time),
	// 					},
	// 				},
	// 			};
	// 		});
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: {
	// 					routes: routes,
	// 				},
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
	// };

	allowedTravelModes = ["DRIVE", "BICYCLE", "TWO_WHEELER", "WALK"];

	allowedParams = {
		intermediates: true,
		routeModifiers: true,
		computeAlternativeRoutes: true,
		optimizeWaypointOrder: true,
	};

	TravelSelectionField = OSMTravelSelectionField;
	convertTravelModeToIcon = convertTravelModeToIconOSM;
	convertTravelModeToLabel = convertTravelModeToLabelOSM;
	AvoidSelectionField = OSMAvoidSelectionField;
}

class TomTomApi extends ComputeRoutes {
	constructor() {
		super();
		this.family = "tomtom";
	}

	convertRequest = (params) => {
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

		const intermediates = params.intermediates
			.map(
				(intermediate) =>
					intermediate.location.latitude +
					"," +
					intermediate.location.longitude
			)
			.join(":");

		return {
			url:
				"https://api.tomtom.com/routing/1/calculateRoute/" +
				params.origin.location.latitude +
				"," +
				params.origin.location.longitude +
				(intermediates ? ":" + intermediates : "") +
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
				"&computeBestOrder=" +
				(params.intermediates.length > 1 &&
					params.optimizeWaypointOrder) +
				"&maxAlternatives=" +
				(params.intermediates.length == 0 &&
				params.computeAlternativeRoutes
					? 2
					: 0) +
				"&routeRepresentation=" +
				"encodedPolyline" +
				"&computeTravelTimeFor=" +
				"all",
			method: "GET",
			// params: {
			// 	language: "en-US",
			// 	key: "key:TOMTOM_API_KEY",
			// 	travelMode: params.travelMode,
			// 	routeType: "fastest",
			// 	traffic: false,
			// 	avoid:
			// 		avoidOptions.length > 0
			// 			? avoidOptions.join("&avoid=")
			// 			: undefined,
			// 	instructionsType: "text", // text
			// 	computeBestOrder:
			// 		params.intermediates.length > 1 &&
			// 		params.optimizeWaypointOrder,
			// 	maxAlternatives:
			// 		params.intermediates.length == 0 &&
			// 		params.computeAlternativeRoutes
			// 			? 2
			// 			: 0,
			// 	routeRepresentation: "encodedPolyline", // Request encoded polyline
			// 	computeTravelTimeFor: "all",
			// },
		};
	};

	convertResponse = (data) => {
		const routes = data.routes.map((route) => {
			return {
				legs: route.legs.map((leg, index) => {
					return {
						steps: route.guidance.instructions.map((step, si) => {
							return {
								navigationInstruction: {
									instructions: step.message,
									maneuver: step.maneuver,
								},
								// travelMode: step.travelMode,
								localizedValues: {
									distance: {
										// text:
										// 	si > 0
										// 		? formatDistance(
										// 				step.length
										// 		  )
										// 		: formatDistance(0),
									},
									staticDuration: {
										// text: formatDuration(
										// 	step.travelTimeInSeconds *
										// 		1000
										// ),
									},
								},
							};
						}),
						polyline: {
							encodedPolyline: leg.encodedPolyline,
						},
						localizedValues: {
							distance: {
								text: formatDistance(
									leg.summary.lengthInMeters
								),
							},
							staticDuration: {
								text: formatDuration(
									leg.summary.noTrafficTravelTimeInSeconds *
										1000
								),
							},
						},
					};
				}),
				distanceMeters: route.summary.lengthInMeters,
				staticDuration: `${route.summary.noTrafficTravelTimeInSeconds}s`,
				polyline: {
					encodedPolyline: route.legs[0].encodedPolyline,
				},
				localizedValues: {
					distance: {
						text: formatDistance(route.summary.lengthInMeters),
					},
					staticDuration: {
						text: formatDuration(
							route.summary.travelTimeInSeconds * 1000
						),
					},
				},
				optimizedIntermediateWaypointIndex: data.optimizedWaypoints
					? data.optimizedWaypoints.map(
							(waypoint) => waypoint.optimizedIndex
					  )
					: undefined,
			};
		});
		return { routes };
	};

	// run = async (params) => {
	// 	console.log("TomTom API");
	// 	const avoidOptions = [];
	// 	if (params.routeModifiers.avoidTolls) avoidOptions.push("tollRoads");
	// 	if (params.routeModifiers.avoidHighways) avoidOptions.push("motorways");
	// 	if (params.routeModifiers.avoidFerries) avoidOptions.push("ferries");

	// 	const intermediates = params.intermediates
	// 		.map(
	// 			(intermediate) =>
	// 				intermediate.location.latitude +
	// 				"," +
	// 				intermediate.location.longitude
	// 		)
	// 		.join(":");

	// 	const p = {
	// 		language: "en-US",
	// 		key: "key:TOMTOM_API_KEY",
	// 		travelMode:
	// 			params.travelMode === "DRIVE"
	// 				? "car"
	// 				: params.travelMode === "BICYCLE"
	// 				? "bicycle"
	// 				: params.travelMode === "TWO_WHEELER"
	// 				? "motorcycle"
	// 				: "pedestrian",
	// 		routeType: "fastest",
	// 		traffic: false,
	// 		avoid: avoidOptions,
	// 		instructionsType: "text", // text
	// 		computeBestOrder:
	// 			params.intermediates.length > 1 && params.optimizeWaypointOrder,
	// 		maxAlternatives:
	// 			params.intermediates.length == 0 &&
	// 			params.computeAlternativeRoutes
	// 				? 2
	// 				: 0,
	// 		routeRepresentation: "encodedPolyline", // Request encoded polyline
	// 		computeTravelTimeFor: "all",
	// 	};
	// 	const apiCall = {
	// 		url:
	// 			"https://api.tomtom.com/routing/1/calculateRoute/" +
	// 			params.origin.location.latitude +
	// 			"," +
	// 			params.origin.location.longitude +
	// 			(intermediates ? ":" + intermediates : "") +
	// 			":" +
	// 			params.destination.location.latitude +
	// 			"," +
	// 			params.destination.location.longitude +
	// 			"/json?" +
	// 			"language=" +
	// 			p.language +
	// 			"&key=" +
	// 			p.key +
	// 			"&travelMode=" +
	// 			p.travelMode +
	// 			"&routeType=" +
	// 			p.routeType +
	// 			"&traffic=" +
	// 			p.traffic +
	// 			(p.avoid.length > 0
	// 				? "&avoid=" + p.avoid.join("&avoid=")
	// 				: "") +
	// 			"&instructionsType=" +
	// 			p.instructionsType +
	// 			"&computeBestOrder=" +
	// 			p.computeBestOrder +
	// 			"&maxAlternatives=" +
	// 			p.maxAlternatives +
	// 			"&routeRepresentation=" +
	// 			p.routeRepresentation +
	// 			"&computeTravelTimeFor=" +
	// 			p.computeTravelTimeFor,
	// 		method: "GET",
	// 	};

	// 	const epochId = Date.now(); // Unique ID for this tool call
	// 	const response = await this.post("/map/cached", apiCall);

	// 	console.log(response);
	// 	// return null;
	// 	if (response.success) {
	// 		const routes = response.data.routes.map((route) => {
	// 			return {
	// 				legs: route.legs.map((leg, index) => {
	// 					return {
	// 						steps: route.guidance.instructions.map(
	// 							(step, si) => {
	// 								return {
	// 									navigationInstruction: {
	// 										instructions: step.message,
	// 										maneuver: step.maneuver,
	// 									},
	// 									// travelMode: step.travelMode,
	// 									localizedValues: {
	// 										distance: {
	// 											// text:
	// 											// 	si > 0
	// 											// 		? formatDistance(
	// 											// 				step.length
	// 											// 		  )
	// 											// 		: formatDistance(0),
	// 										},
	// 										staticDuration: {
	// 											// text: formatDuration(
	// 											// 	step.travelTimeInSeconds *
	// 											// 		1000
	// 											// ),
	// 										},
	// 									},
	// 								};
	// 							}
	// 						),
	// 						polyline: {
	// 							encodedPolyline: leg.encodedPolyline,
	// 						},
	// 						localizedValues: {
	// 							distance: {
	// 								text: formatDistance(
	// 									leg.summary.lengthInMeters
	// 								),
	// 							},
	// 							staticDuration: {
	// 								text: formatDuration(
	// 									leg.summary
	// 										.noTrafficTravelTimeInSeconds * 1000
	// 								),
	// 							},
	// 						},
	// 					};
	// 				}),
	// 				distanceMeters: route.summary.lengthInMeters,
	// 				staticDuration: `${route.summary.noTrafficTravelTimeInSeconds}s`,
	// 				polyline: {
	// 					encodedPolyline: route.legs[0].encodedPolyline,
	// 				},
	// 				localizedValues: {
	// 					distance: {
	// 						text: formatDistance(route.summary.lengthInMeters),
	// 					},
	// 					staticDuration: {
	// 						text: formatDuration(
	// 							route.summary.travelTimeInSeconds * 1000
	// 						),
	// 					},
	// 				},
	// 				optimizedIntermediateWaypointIndex: response.data
	// 					.optimizedWaypoints
	// 					? response.data.optimizedWaypoints.map(
	// 							(waypoint) => waypoint.optimizedIndex
	// 					  )
	// 					: undefined,
	// 			};
	// 		});
	// 		return {
	// 			success: true,
	// 			data: {
	// 				result: { routes },
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

	allowedTravelModes = ["CAR", "BICYCLE", "TWO_WHEELER", "WALK"];

	TravelSelectionField = TTTravelSelectionField;
	convertTravelModeToIcon = convertTravelModeToIconTT;
	convertTravelModeToLabel = convertTravelModeToLabelTT;
	AvoidSelectionField = TTAvoidSelectionField;
}

export const list = {
	googleMaps: [
		{
			name: "Google Maps API (New)",
			icon: config.baseUrl + "/images/google-maps.png",
			instance: new GoogleRoutesApi(),
		},
	],
	openStreetMap: [
		{
			name: "GraphHopper API",
			icon: config.baseUrl + "/images/graphhopper.png",
			instance: new GraphHopperApi(),
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

"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { AppContext } from "./AppContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import mapsApi from "@/api/googleMapsApi";
export const GlobalContext = createContext();
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { list as textSearchList } from "@/tools/TextSearch";
import { list as placeDetailsList } from "@/tools/PlaceDetails";
import { list as nearbySearchList } from "@/tools/NearbySearch";
import { list as computeRoutesList } from "@/tools/ComputeRoutes";
import { list as searchAlongRouteList } from "@/tools/SearchAlongRoute";
import queryApi from "@/api/queryApi";
import { useAuth } from "./AuthContext";

export default function GlobalContextProvider({ children }) {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams(); // Get the search parameters
	const id = searchParams.get("id");
	const exampleDistanceMatrix = {
		1: {
			2: {
				walking: {
					distance: "5 km",
					duration: "6 mins",
				},
				driving: {
					distance: "5 km",
					duration: "6 mins",
				},
				bicycling: {
					distance: "5 km",
					duration: "6 mins",
				},
				transit: {
					distance: "5 km",
					duration: "6 mins",
				},
			},
		},
		2: {
			1: {
				walking: {
					distance: "5 km",
					duration: "6 mins",
				},
				driving: {
					distance: "5 km",
					duration: "6 mins",
				},
				bicycling: {
					distance: "5 km",
					duration: "6 mins",
				},
				transit: {
					distance: "5 km",
					duration: "6 mins",
				},
			},
		},
	};
	const exampleSelectedPlacesMap = {
		1: {
			selectedAttributes: ["formatted_address", "rating"],
			attributes: [
				"formatted_address",
				"name",
				"place_id",
				"rating",
				"geometry",
			],
		},
		2: {
			selectedAttributes: ["formatted_address"],
			attributes: [
				"formatted_address",
				"name",
				"place_id",
				"rating",
				"geometry",
			],
		},
	};
	const exampleNearbyPlacesMap = {
		1: [
			{
				type: "restaurant",
				rankby: "distance",
				keyword: "",
				places: [
					{
						name: "Dhanmondi, Uttara, Farmgate, Indira Road",
						formatted_address: "Dhanmondi 27 road",
						selected: true,
					},
					{
						name: "Farmgate",
						formatted_address: "Indira road, Dhaka",
						selected: true,
					},
				],
			},
		],
	};
	const examplePoisMap = {
		1: [
			{
				type: "restaurant",
				places: [
					{
						name: "Dhanmondi",
						formatted_address: "Dhanmondi 27 road",
						selected: true,
					},
					{
						name: "Farmgate",
						formatted_address: "Indira road, Dhaka",
						selected: true,
					},
				],
			},
		],
	};
	const exampleDirectionInformation = {
		1: {
			2: {
				walking: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Mirpur",
							steps: [],
						},
					],
					showSteps: true,
				},
				driving: {
					routes: [
						{
							distance: "4.5 km",
							duration: "1 hr 45 min",
							label: "Uttara",
							steps: [],
						},
					],
					showSteps: true,
				},
				bicycling: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Jhigatola",
							steps: [],
						},
					],
					showSteps: true,
				},
				transit: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Uttara",
							steps: ["Go left from <b>Md pur</b>", "Then right"],
						},
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Dhanmondi",
							steps: ["Go left from Md pur", "Then right"],
						},
					],
					showSteps: true,
				},
			},
		},
	};
	const exampleCurrentInformation = {
		time: dayjs("2024-07-22T21:00:00.000Z"),
		day: "Monday",
		location: 1,
	};

	const initSelectedPlacesMap = {};

	const initPoisMap = {};
	const initDistanceMatrix = {};
	const initDirectionInformation = [];
	const initRoutePlacesMap = [];
	const initNearbyPlacesMap = [];
	const initCurrentInformation = {
		time: null,
		day: "",
		location: "",
	};

	const [context, setContext] = useState({
		places: [],
		nearby: [],
		area: [],
		distance: [],
		direction: [],
		params: [],
	});
	const [activeStep, setActiveStep] = useState(0);
	const [llmResults, setLlmResults] = useState({});
	const [contextStatus, setContextStatus] = useState("empty");
	const [queryStatus, setQueryStatus] = useState("empty");
	const [answerStatus, setAnswerStatus] = useState("empty");

	const [evaluationStatus, setEvaluationStatus] = useState("empty");

	const [selectedPlacesMap, setSelectedPlacesMap] = useState(
		initSelectedPlacesMap
	);
	const [nearbyPlacesMap, setNearbyPlacesMap] = useState(initNearbyPlacesMap);
	const [routePlacesMap, setRoutePlacesMap] = useState(initRoutePlacesMap);
	const [poisMap, setPoisMap] = useState(initPoisMap);
	const [distanceMatrix, setDistanceMatrix] = useState(initDistanceMatrix);
	const [directionInformation, setDirectionInformation] = useState(
		initDirectionInformation
	);
	const [currentInformation, setCurrentInformation] = useState(
		initCurrentInformation
	);

	const [newPlaceId, setNewPlaceId] = useState();
	const [newDistance, setNewDistance] = useState({
		origins: [],
		destinations: [],
		travelMode: "WALK",
	});

	const initNewNearbyPlaces = {
		locationBias: "",
		searchBy: "type",
		type: "",
		keyword: "",
		rankPreference: "RELEVANCE",
		radius: 0,
		minRating: 0, // Values are rounded up to the nearest 0.5.
		priceLevels: [],
		maxResultCount: 5, // 1 to 20
	};
	const [newNearbyPlaces, setNewNearbyPlaces] = useState(initNewNearbyPlaces);

	const initNewRoutePlaces = {
		origin: "",
		destination: "",
		travelMode: "WALK",
		encodedPolyline: "",
		routeModifiers: {
			avoidTolls: false,
			avoidHighways: false,
			avoidFerries: false,
		},
		computeAlternativeRoutes: false,
		intermediates: [],
		searchBy: "type",
		type: "",
		keyword: "",
		rankPreference: "RELEVANCE",
		minRating: 0, // Values are rounded up to the nearest 0.5.
		priceLevels: [],
		maxResultCount: 5,
	};

	const [newRoutePlaces, setNewRoutePlaces] = useState(initNewRoutePlaces);
	const initNewDirection = {
		origin: "",
		destination: "",
		intermediates: [],
		travelMode: "",
		// departureTime: {
		// 	type: "now",
		// 	date: dayjs(),
		// 	time: dayjs(),
		// 	departureTimestamp: new Date(),
		// },
		optimizeWaypointOrder: false,
		// transitPreferences: {
		// 	allowedTravelModes: [],
		// },
		routeModifiers: {
			// avoidTolls: false,
			// avoidHighways: false,
			// avoidFerries: false,
		},
		computeAlternativeRoutes: true,
	};

	const [newDirection, setNewDirection] = useState(initNewDirection);

	// const initQuery = {
	// 	question: "Time to go from Louvre to Eiffel Tower by car?",
	// 	answer: {
	// 		type: "mcq",
	// 		options: ["15 mins", "16 mins", "17 mins", "18 mins"],
	// 		correct: 2,
	// 	},
	// 	classification: "poi",
	// };

	const initQuery = {
		question: "",
		answer: {
			type: "open-ended",
			// options: ["Option 1", "Option 2", "Option 3", "Option 4"],
			correct: "",
		},
		classification: "",
	};

	// const [query, setQuery] = useState({
	// 	questions: [initQuery],
	// });

	const [query, setQuery] = useState(initQuery);

	const [savedPlacesMap, setSavedPlacesMap] = useState({});
	const [apiCallLogs, setApiCallLogs] = useState([]);

	const [mapService, setMapService] = useState("all");
	const [tools, setTools] = useState({
		textSearch: null,
		placeDetails: null,
		nearbySearch: null,
		computeRoutes: null,
		searchAlongRoute: null,
	});

	useEffect(() => {
		console.log("mapService", mapService);
		if (mapService === "all") {
			setTools({
				textSearch: textSearchList["googleMaps"][0].instance,
				placeDetails: placeDetailsList["googleMaps"][0].instance,
				nearbySearch: nearbySearchList["googleMaps"][0].instance,
				computeRoutes: computeRoutesList["googleMaps"][0].instance,
				searchAlongRoute:
					searchAlongRouteList["googleMaps"][0].instance,
			});
		} else {
			setTools({
				textSearch:
					textSearchList[mapService] &&
					textSearchList[mapService][0]?.instance,
				placeDetails:
					placeDetailsList[mapService] &&
					placeDetailsList[mapService][0]?.instance,
				nearbySearch:
					nearbySearchList[mapService] &&
					nearbySearchList[mapService][0]?.instance,
				computeRoutes:
					computeRoutesList[mapService] &&
					computeRoutesList[mapService][0]?.instance,
				searchAlongRoute:
					searchAlongRouteList[mapService] &&
					searchAlongRouteList[mapService][0]?.instance,
			});
		}
	}, [mapService]);

	useEffect(() => {
		setNewNearbyPlaces((prev) => ({
			...prev,
			type: "",
		}));
		setNewDirection((prev) => ({
			...prev,
			travelMode: "",
			routeModifiers: {},
		}));
		setNewRoutePlaces((prev) => ({
			...prev,
			travelMode: "",
			routeModifiers: {},
			type: "",
		}));
	}, [tools]);

	useEffect(() => {
		setContext({
			places: ContextGeneratorService.getPlacesContext(
				selectedPlacesMap,
				savedPlacesMap
			),
			nearby: ContextGeneratorService.getNearbyContext(
				nearbyPlacesMap,
				savedPlacesMap
			),
			// area: ContextGeneratorService.getAreaContext(
			// 	poisMap,
			// 	savedPlacesMap
			// ),
			// distance: ContextGeneratorService.getDistanceContext(
			// 	distanceMatrix,
			// 	savedPlacesMap
			// ),
			direction: ContextGeneratorService.getDirectionContext(
				directionInformation,
				savedPlacesMap
			),
			// params: ContextGeneratorService.getParamsContext(
			// 	currentInformation,
			// 	savedPlacesMap
			// ),
		});
	}, [
		savedPlacesMap,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		distanceMatrix,
		directionInformation,
		currentInformation,
	]);

	useEffect(() => {
		if (queryStatus === "saved") {
			setQueryStatus("edited");
			setLlmResults({});
		}
	}, [query]);

	useEffect(() => {
		if (contextStatus === "saved") {
			setContextStatus("edited");
			setLlmResults({});
		}
	}, [context]);

	useEffect(() => {
		if (answerStatus === "saved") {
			setAnswerStatus("edited");
			setLlmResults({});
		}
	}, [query.answer]);

	const fetchQuery = async (id) => {
		const res = await queryApi.getNewQuery(id);
		if (res.success) {
			const query = res.data[0];
			setSavedPlacesMap(query.context_json.places ?? {});
			setSelectedPlacesMap(query.context_json.place_details ?? {});
			setNearbyPlacesMap(query.context_json.nearby_places ?? []);
			setDirectionInformation(query.context_json.directions ?? []);
			setRoutePlacesMap(query.context_json.route_places ?? []);
			setApiCallLogs(query.api_call_logs ?? []);
			setQuery(query);
		}
	};
	useEffect(() => {
		if (id && query.id !== id && isAuthenticated) {
			fetchQuery(id);
		}
	}, [id]); // 'id' is the dependency

	return (
		<GlobalContext.Provider
			value={{
				apiCallLogs,
				setApiCallLogs,
				context,
				setContext,
				distanceMatrix,
				setDistanceMatrix,
				selectedPlacesMap,
				setSelectedPlacesMap,
				nearbyPlacesMap,
				setNearbyPlacesMap,
				currentInformation,
				setCurrentInformation,
				directionInformation,
				setDirectionInformation,
				poisMap,
				setPoisMap,
				initQuery,
				query,
				setQuery,
				exampleSelectedPlacesMap,
				exampleNearbyPlacesMap,
				examplePoisMap,
				exampleDistanceMatrix,
				exampleDirectionInformation,
				exampleCurrentInformation,
				initSelectedPlacesMap,
				initNearbyPlacesMap,
				initPoisMap,
				initDistanceMatrix,
				initDirectionInformation,
				initCurrentInformation,
				initRoutePlacesMap,
				contextStatus,
				setContextStatus,
				queryStatus,
				setQueryStatus,
				answerStatus,
				setAnswerStatus,
				evaluationStatus,
				setEvaluationStatus,
				llmResults,
				setLlmResults,
				activeStep,
				setActiveStep,
				newDistance,
				setNewDistance,
				newNearbyPlaces,
				setNewNearbyPlaces,
				newDirection,
				setNewDirection,
				routePlacesMap,
				setRoutePlacesMap,
				newRoutePlaces,
				setNewRoutePlaces,
				savedPlacesMap,
				setSavedPlacesMap,
				tools,
				setTools,
				mapService,
				setMapService,
				newPlaceId,
				setNewPlaceId,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import mapApi from "@/api/mapApi";
import {
	TextField,
	Grid,
	FormControlLabel,
	RadioGroup,
	Radio,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	ListItemText,
	Checkbox,
	OutlinedInput,
	Box,
	Paper,
} from "@mui/material";
import types from "@/database/newtypes.json";
import { LoadingButton } from "@mui/lab";
import { Add, Search } from "@mui/icons-material";
import PlaceSelectionField from "@/components/GoogleMaps/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useContext } from "react";
import TypeSelectionField from "@/mapServices/GoogleMaps/TypeSelectionField";
import { AppContext } from "@/contexts/AppContext";
import { showError } from "@/contexts/ToastProvider";
import {
	GoogleMap,
	LoadScript,
	useJsApiLoader,
	Marker,
} from "@react-google-maps/api";
import PoiSelectionField from "../InputFields/PoiSelectionField";
import NearbyComponent from "../Embed/NearbyComponent";
import debounce from "lodash/debounce";

const placeTypes = [];
for (const category in types) {
	placeTypes.push(...types[category]);
}
console.log(placeTypes);

//  PRICE_LEVEL_FREE is not allowed in a request. It is only used to populate the response.
const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

export default function NearbyForm({
	handlePlaceAdd,
	newNearbyPlaces,
	setNewNearbyPlaces,
}) {
	const {
		selectedPlacesMap,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
		tools,
	} = useContext(GlobalContext);

	const [list, setList] = useState([]);
	const [apiCalls, setApiCalls] = useState([]);
	const [routingSummaries, setRoutingSummaries] = useState([]);
	const [uuid, setUuid] = useState("");

	const { apiCallLogs, setApiCallLogs } = useContext(GlobalContext);

	const [mapsApi, setMapsApi] = useState(null);
	useEffect(() => {
		const loadMapsApi = async () => {
			const mapsModule = await import(
				process.env.NEXT_PUBLIC_MAPS_API_PATH
			);
			setMapsApi(mapsModule.default);
		};

		loadMapsApi();
	}, []);

	const handleSave = async (place) => {
		let details = savedPlacesMap[place.id];
		if (details === undefined) {
			setSavedPlacesMap((prev) => ({
				...prev,
				[place.id]: {
					...place,
					uuid,
					mapService: tools.nearbySearch.family,
					hidden: true,
				},
			}));
		}
	};

	console.log("New nearby: ", newNearbyPlaces);

	const [loading, setLoading] = useState(false);
	const searchNearbyPlaces = async () => {
		if (newNearbyPlaces.locationBias === "" || newNearbyPlaces.type === "")
			return;
		setLoading(true);

		if (list.length > 0) {
			const places = list;

			const newNearbyPlacesMap = [...nearbyPlacesMap];

			newNearbyPlacesMap.push({
				locationBias: newNearbyPlaces.locationBias,
				type: newNearbyPlaces.type,
				keyword: newNearbyPlaces.keyword,
				minRating: newNearbyPlaces.minRating,
				priceLevels: newNearbyPlaces.priceLevels,
				rankPreference: newNearbyPlaces.rankPreference,
				maxResultCount: newNearbyPlaces.maxResultCount,
				places: places,
				routingSummaries: routingSummaries,
				uuid,
			});

			setNearbyPlacesMap(newNearbyPlacesMap);
			setApiCallLogs((prev) => [...prev, ...apiCalls]);
			setNewNearbyPlaces((prev) => ({
				...prev,
				type: "",
				keyword: "",
			}));
			setLoading(false);

			places.forEach((place) => {
				handleSave(place);
			});
		} else {
			showError("Couldn't find nearby places.");
		}
		setLoading(false);
	};

	const fetchNearbyPlaces = async (data) => {
		if (data.locationBias === "" || data.type === "") return;
		setLoading(true);
		const location = savedPlacesMap[data.locationBias].location;
		const lat = location.latitude;
		const lng = location.longitude;

		const response = await tools.nearbySearch.fetch({
			lat,
			lng,
			locationBias: data.locationBias,
			searchBy: data.searchBy,
			type: data.type,
			keyword: data.keyword,
			rankPreference: data.rankPreference,
			minRating: data.minRating,
			priceLevels: data.priceLevels,
			maxResultCount: data.maxResultCount,
		});

		if (response.success) {
			const places = response.data.result.places;
			setList(places);
			setApiCalls(response.data.apiCallLogs);
			setUuid(response.data.uuid);
			setRoutingSummaries(response.data.result.routingSummaries);
		} else {
			showError("Couldn't find nearby places.");
		}
		setLoading(false);
	};
	// Wrap the fetchNearbyPlaces function with debounce
	const debouncedFetchNearbyPlaces = useCallback(
		debounce(fetchNearbyPlaces, 1000),
		[tools]
	);

	useEffect(() => {
		debouncedFetchNearbyPlaces(newNearbyPlaces);
	}, [newNearbyPlaces, debouncedFetchNearbyPlaces]);

	return newNearbyPlaces && tools.nearbySearch ? (
		<Box className="flex flex-col md:flex-row gap-4">
			<Box className="w-full md:w-1/2">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<PlaceSelectionField
							label="Location"
							value={newNearbyPlaces.locationBias}
							onChange={(e) =>
								setNewNearbyPlaces((prev) => ({
									...prev,
									locationBias: e.target.value,
								}))
							}
							handlePlaceAdd={handlePlaceAdd}
						/>
					</Grid>

					<Grid item xs={12}>
						<tools.nearbySearch.PoiCategorySelectionField
							type={newNearbyPlaces.type}
							setType={(newValue) => {
								setNewNearbyPlaces((prev) => ({
									...prev,
									type: newValue,
								}));
							}}
						/>
					</Grid>

					{tools.nearbySearch.allowedParams.minRating && (
						<Grid item xs={12}>
							<TextField
								type="number"
								value={newNearbyPlaces.minRating}
								label="Min Rating"
								onChange={(e) =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										minRating: e.target.value,
									}))
								}
								inputProps={{ step: 0.5, min: 0, max: 5 }}
								size="small"
								fullWidth
							/>
						</Grid>
					)}

					{tools.nearbySearch.allowedParams.priceLevels && (
						<Grid item xs={12}>
							<FormControl fullWidth size="small">
								<InputLabel>Price</InputLabel>
								<Select
									// input={<OutlinedInput label="Tag" />}
									value={newNearbyPlaces.priceLevels}
									onChange={(e) =>
										setNewNearbyPlaces((prev) => ({
											...prev,
											priceLevels: e.target.value,
										}))
									}
									label={"Price"}
									multiple
									renderValue={(selected) => {
										if (selected.length === 0) {
											return <em>Any</em>; // Custom label for empty array
										}
										return selected
											.map(
												(value) =>
													priceMap[value] || value
											)
											.join(", ");
									}}
								>
									{Object.keys(priceMap).map((key) => (
										<MenuItem key={key} value={key}>
											<Checkbox
												checked={
													newNearbyPlaces.priceLevels.indexOf(
														key
													) > -1
												}
											/>
											<ListItemText
												primary={priceMap[key]}
											/>
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Typography variant="caption">
								The default is to select all price levels.
							</Typography>
						</Grid>
					)}

					{tools.nearbySearch.allowedParams.rankPreference && (
						<Grid item xs={12}>
							<RadioGroup
								row
								value={newNearbyPlaces.rankPreference}
								onChange={(e) =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										rankPreference: e.target.value,
									}))
								}
							>
								<FormControlLabel
									value="RELEVANCE"
									control={<Radio />}
									label="Rank by Relevance"
								/>
								<FormControlLabel
									value="DISTANCE"
									control={<Radio />}
									label="Rank by Distance"
								/>
							</RadioGroup>
						</Grid>
					)}

					{tools.nearbySearch.allowedParams.radius && (
						<Grid item xs={12}>
							<TextField
								fullWidth
								size="small"
								label="Radius (meters)"
								type="number"
								value={newNearbyPlaces.radius}
								onChange={(e) =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										radius: e.target.value,
									}))
								}
							/>
						</Grid>
					)}

					{tools.nearbySearch.allowedParams.maxResultCount && (
						<Grid item xs={12}>
							<TextField
								type="number"
								label="Max Results (1 to 20)"
								value={newNearbyPlaces.maxResultCount}
								onChange={(e) =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										maxResultCount: e.target.value,
									}))
								}
								fullWidth
								size="small"
								inputProps={{ min: 1, max: 20, step: 1 }}
							/>
						</Grid>
					)}

					<Grid item xs={12}>
						<LoadingButton
							variant="contained"
							fullWidth
							onClick={searchNearbyPlaces}
							startIcon={<Add />}
							loading={loading}
							loadingPosition="start"
						>
							Add Nearby POIs
						</LoadingButton>
					</Grid>
				</Grid>
			</Box>

			<Box className="w-full md:w-1/2">
				<Paper elevation={2}>
					<Box>
						<Typography
							variant="h6"
							className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
						>
							Map View
						</Typography>
					</Box>
					{newNearbyPlaces.locationBias === "" ? (
						<Box className="h-[365px] flex flex-row items-center justify-center">
							<h1
								// variant="body1"
								className="text-center p-4 text-xl text-zinc-400"
							>
								Select a location to view nearby places.
							</h1>
						</Box>
					) : (
						<NearbyComponent
							height={"365px"}
							places={list}
							locationBias={
								savedPlacesMap[newNearbyPlaces.locationBias]
							}
							radius={
								tools.nearbySearch.allowedParams.radius &&
								newNearbyPlaces.radius
							}
						/>
					)}
				</Paper>
			</Box>
		</Box>
	) : (
		<p className="text-center">No API Available</p>
	);
}

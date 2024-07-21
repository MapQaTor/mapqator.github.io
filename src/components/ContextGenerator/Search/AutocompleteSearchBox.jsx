"use client";

import React, { useContext, useEffect, useState } from "react";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();

import {
	Button,
	TextField,
	Divider,
	ListItemText,
	ListItem,
} from "@mui/material";
import _ from "lodash";

import { LoadingButton } from "@mui/lab";
import { Add, Clear, Download, Search, Start } from "@mui/icons-material";
import Fuse from "fuse.js";
import { useCallback } from "react";
import { Chip, CircularProgress, InputAdornment } from "@mui/material";
import debounce from "lodash/debounce";
import { GlobalContext } from "@/contexts/GlobalContext";

function SearchPlaceCard({ place, index, length }) {
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
	} = useContext(GlobalContext);

	const handleAddPlace = async (place) => {
		if (selectedPlacesMap[place.place_id]) return;

		let details = savedPlacesMap[place.place_id];
		if (!details) {
			const res = await mapApi.getDetails(place.place_id);
			if (res.success) {
				details = res.data.result;
				setSavedPlacesMap((prev) => ({
					...prev,
					[place.place_id]: details,
				}));
			} else {
				console.error("Error fetching place details:", res.error);
				return;
			}
		}

		setSelectedPlacesMap((prev) => ({
			...prev,
			[place.place_id]: {
				// alias: "",
				selectedAttributes: ["formatted_address"],
				attributes: Object.keys(details).filter(
					(key) => details[key] !== null
				),
			},
		}));
	};

	// Issue: Name overlaps with Add button
	return (
		<React.Fragment key={index}>
			<ListItem
				secondaryAction={
					<Button
						startIcon={<Add />}
						onClick={() => handleAddPlace(place)}
						disabled={selectedPlacesMap[place.place_id]}
					>
						Add
					</Button>
				}
			>
				<ListItemText
					primary={place.name}
					secondary={place.formatted_address}
				/>
			</ListItem>
			{index < length - 1 && <Divider component="li" />}
		</React.Fragment>
	);
}
export default function AutocompleteSearchBox() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [mapResults, setMapResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [recentSearches, setRecentSearches] = useState([]);
	const [shouldFetchFromAPI, setShouldFetchFromAPI] = useState(false);
	const [cache, setCache] = useState({});
	const { savedPlacesMap } = useContext(GlobalContext);

	const fuseOptions = {
		keys: ["name", "formatted_address"],
		threshold: 0.3,
		ignoreLocation: true,
	};
	const [fuse, setFuse] = useState(
		new Fuse(Object.values(savedPlacesMap), fuseOptions)
	);
	// Update fuse object whenever savedPlacesMap changes
	useEffect(() => {
		const newFuse = new Fuse(Object.values(savedPlacesMap), fuseOptions);
		setFuse(newFuse);
	}, [savedPlacesMap]);

	const searchMap = async (query) => {
		setLoading(true);
		try {
			const response = await mapApi.search(query);
			if (response.success) {
				setMapResults([...response.data.results]);
				// setCache((prev) => ({
				// 	...prev,
				// 	[query]: response.data.results,
				// }));
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		setLoading(false);
		setShouldFetchFromAPI(false);
	};

	const handleSearch = useCallback(
		debounce(async (query) => {
			console.log("Searching for: ", query, fuse);
			if (!fuse) return;

			setLoading(true);

			// Search in saved places
			// Local search
			const localResults = fuse
				.search(query)
				.map((result) => result.item);
			setResults(localResults);

			// Check cache
			// if (cache[query]) {
			//      setResults([...localResults, ...cache[query]]);
			//      setLoading(false);
			// 	    return;
			// }

			setLoading(false);
		}, 300),
		[savedPlacesMap]
	);

	useEffect(() => {
		if (search) {
			handleSearch(search);
			// setRecentSearches((prev) =>
			// 	[search, ...prev.filter((s) => s !== search)].slice(0, 5)
			// );
		}
	}, [search, handleSearch, savedPlacesMap]);

	const handleKeyPress = (event) => {
		console.log("Key Pressed: ", event.key);
		if (event.key === "Enter") {
			setShouldFetchFromAPI(true);
			searchMap(search);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<TextField
				autoComplete="off"
				fullWidth
				onKeyPress={handleKeyPress}
				variant="outlined"
				placeholder="Search for a place"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							{loading ? (
								<CircularProgress size={20} />
							) : (
								search && (
									<Clear
										className="cursor-pointer"
										onClick={() => setSearch("")}
									/>
								)
							)}
						</InputAdornment>
					),
				}}
			/>

			{/* {recentSearches.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{recentSearches.map((recentSearch, index) => (
						<Chip
							key={index}
							label={recentSearch}
							onClick={() => setSearch(recentSearch)}
							onDelete={() =>
								setRecentSearches((prev) =>
									prev.filter((s) => s !== recentSearch)
								)
							}
						/>
					))}
				</div>
			)} */}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{results.length > 0 && (
					<div className="border rounded-lg overflow-hidden">
						<h3 className="bg-gray-200 p-2 font-bold">
							Saved Places
						</h3>
						<ul className="max-h-60 overflow-y-auto">
							{results.map((place, index) => (
								<SearchPlaceCard
									place={place}
									index={index}
									length={results.length}
								/>
							))}
						</ul>
					</div>
				)}

				{mapResults.length > 0 && (
					<div className="border rounded-lg overflow-hidden">
						<h3 className="bg-gray-200 p-2 font-bold">
							Google Places Results
						</h3>
						<ul className="max-h-60 overflow-y-auto">
							{mapResults.map((place, index) => (
								<SearchPlaceCard
									place={place}
									index={index}
									length={results.length}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

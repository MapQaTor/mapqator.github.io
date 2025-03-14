import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	Chip,
	Typography,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import categories from "@/database/categories.json";
import { convertFromSnake } from "@/services/utils";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import Pluralize from "pluralize";

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};
const travelMap = {
	DRIVE: "Driving",
	WALK: "Walking",
	BICYCLE: "Bicycling",
	TWO_WHEELER: "Two Wheeler",
};

export default function ReferenceSelectionField({
	apiCallLogs,
	index,
	savedPlacesMap,
	selectedPlacesMap,
	nearbyPlacesMap,
	directionInformation,
	routePlacesMap,
}) {
	const { query, setQuery } = useContext(GlobalContext);
	const [references, setReferences] = useState([]);

	useEffect(() => {
		convert();
	}, [apiCallLogs]);

	const convertFromApi = () => {
		const references = [];
		const places = {};
		for (let i = 0; i < apiCallLogs.length; i++) {
			if (
				// PlaceDetails
				apiCallLogs[i].url.startsWith(
					"https://places.googleapis.com/v1/places/"
				)
			) {
				references.push({
					value: apiCallLogs[i].uuid,
					label: `Detailed information of ${apiCallLogs[i].result.displayName.text}`,
				});
			} else if (
				// NearbySearch
				apiCallLogs[i].url.startsWith(
					"https://places.googleapis.com/v1/places:searchText"
				) &&
				apiCallLogs[i].body.hasOwnProperty("includedType")
			) {
				const coords = apiCallLogs[i].body.locationBias.circle.center;

				// Search in places dict for the key with same coordinates

				let locationBias = Object.keys(places).find((key) => {
					const place = places[key];
					return (
						place.location.latitude === coords.latitude &&
						place.location.longitude === coords.longitude
					);
				});

				const e = apiCallLogs[i].body;

				references.push({
					value: apiCallLogs[i].uuid,
					label: `Nearby ${Pluralize(
						convertFromSnake(e.includedType)
					)} of ${places[locationBias].displayName.text}${
						e.minRating > 0
							? " with a minimum rating of " + e.minRating
							: ""
					}${
						e.priceLevels.length > 0
							? (e.minRating > 0 ? " and " : " ") +
							  "price levels " +
							  e.priceLevels.map((p) => priceMap[p]).join(" or ")
							: ""
					}${
						e.rankPreference === "DISTANCE"
							? " (Rank by Distance)"
							: ""
					}`,
				});

				// Add place names to placeNames for future reference
				apiCallLogs[i].result.places.map((place) => {
					places[place.id] = place;
				});
			} else if (
				// TextSearch
				apiCallLogs[i].url.startsWith(
					"https://places.googleapis.com/v1/places:searchText"
				)
			) {
				// Add place names to placeNames for future reference
				apiCallLogs[i].result.places.map((place) => {
					places[place.id] = place;
				});
			} else if (
				// ComputeRoutes
				apiCallLogs[i].url.startsWith(
					"https://routes.googleapis.com/directions/v2:computeRoutes"
				) &&
				apiCallLogs[i].body.hasOwnProperty("intermediates")
			) {
				const direction = apiCallLogs[i].body;
				let text = "";
				if (direction.optimizeWaypointOrder) {
					text = `Optimized `;
				} else {
					text = ``;
				}

				text += `${travelMap[direction.travelMode]} route from ${
					places[direction.origin.placeId].displayName.text
				} to ${places[direction.destination.placeId].displayName.text}`;

				if (direction.intermediates.length > 0) {
					text += ` via ${direction.intermediates
						.map(
							(intermediate) =>
								places[intermediate.placeId].displayName.text
						)
						.join(", ")}`;
				}

				if (
					direction.routeModifiers.avoidTolls ||
					direction.routeModifiers.avoidHighways ||
					direction.routeModifiers.avoidFerries ||
					direction.routeModifiers.avoidIndoor
				) {
					text += ` (Avoiding `;
					const avoid = [];
					if (e.routeModifiers.avoidTolls) {
						avoid.push(`tolls`);
					}
					if (e.routeModifiers.avoidHighways) {
						avoid.push(`highways`);
					}
					if (e.routeModifiers.avoidFerries) {
						avoid.push(`ferries`);
					}
					if (e.routeModifiers.avoidIndoor) {
						avoid.push(`indoor`);
					}
					text += avoid.join(", ");
					text += `)`;
				}

				references.push({
					value: apiCallLogs[i].uuid,
					label: text,
				});
			} else if (
				// SearchAlongRoute
				apiCallLogs[i].url.startsWith(
					"https://routes.googleapis.com/directions/v2:computeRoutes"
				)
			) {
				// Do staff
				const route = apiCallLogs[i];
				const nearby = apiCallLogs[i + 1];

				console.log("Route", route);
				let text = `${Pluralize(
					convertFromSnake(nearby.body.includedType)
				)} along the ${travelMap[route.body.travelMode]} route from ${
					places[route.body.origin.placeId].displayName.text
				} to ${
					places[route.body.destination.placeId].displayName.text
				}`;

				if (
					route.body.routeModifiers.avoidTolls ||
					route.body.routeModifiers.avoidHighways ||
					route.body.routeModifiers.avoidFerries ||
					route.body.routeModifiers.avoidIndoor
				) {
					text += ` (Avoiding `;
					const avoid = [];
					if (e.routeModifiers.avoidTolls) {
						avoid.push(`tolls`);
					}
					if (e.routeModifiers.avoidHighways) {
						avoid.push(`highways`);
					}
					if (e.routeModifiers.avoidFerries) {
						avoid.push(`ferries`);
					}
					if (e.routeModifiers.avoidIndoor) {
						avoid.push(`indoor`);
					}
					text += avoid.join(", ");
					text += `)`;
				}

				text += `${
					nearby.body.minRating > 0
						? " with a minimum rating of " + nearby.body.minRating
						: ""
				}${
					nearby.body.priceLevels.length > 0
						? (nearby.body.minRating > 0 ? " and " : " ") +
						  "price levels " +
						  nearby.body.priceLevels
								.map((p) => priceMap[p])
								.join(" or ")
						: ""
				}${
					nearby.body.rankPreference === "DISTANCE"
						? " (Rank by Distance)"
						: ""
				}`;

				references.push({
					value: apiCallLogs[i].uuid,
					label: text,
				});

				// Add place names to placeNames for future reference
				nearby.result.places.map((place) => {
					places[place.id] = place;
				});
				i++;
			}
		}
		setReferences(references);
	};

	const convert = () => {
		const references = [];

		// selectedPlacesMap
		Object.keys(selectedPlacesMap).map((placeId) => {
			const text = `Detailed information of ${savedPlacesMap[placeId].displayName.text}`;
			references.push({
				value: selectedPlacesMap[placeId].uuid,
				label: text,
			});
		});

		// nearbyPlacesMap
		nearbyPlacesMap.map((e) => {
			const text = `Nearby ${Pluralize(convertFromSnake(e.type))} of ${
				savedPlacesMap[e.locationBias].displayName.text
			}${
				e.minRating > 0
					? " with a minimum rating of " + e.minRating
					: ""
			}${
				e.priceLevels.length > 0
					? (e.minRating > 0 ? " and " : " ") +
					  "price levels " +
					  e.priceLevels.map((p) => priceMap[p]).join(" or ")
					: ""
			}${e.rankPreference === "DISTANCE" ? " (Rank by Distance)" : ""}`;

			references.push({
				value: e.uuid,
				label: text,
			});
		});

		// directionInformation
		directionInformation.map((e) => {
			let text = "";
			if (e.optimizeWaypointOrder) {
				text = `Optimized `;
			} else {
				text = ``;
			}

			text += `${travelMap[e.travelMode]} route from ${
				savedPlacesMap[e.origin].displayName.text
			} to ${savedPlacesMap[e.destination].displayName.text}`;

			if (e.intermediates.length > 0) {
				text += ` via ${e.intermediates
					.map(
						(intermediate) =>
							savedPlacesMap[intermediate].displayName.text
					)
					.join(", ")}`;
			}

			if (
				e.routeModifiers.avoidTolls ||
				e.routeModifiers.avoidHighways ||
				e.routeModifiers.avoidFerries ||
				e.routeModifiers.avoidIndoor
			) {
				text += ` (Avoiding `;
				const avoid = [];
				if (e.routeModifiers.avoidTolls) {
					avoid.push(`tolls`);
				}
				if (e.routeModifiers.avoidHighways) {
					avoid.push(`highways`);
				}
				if (e.routeModifiers.avoidFerries) {
					avoid.push(`ferries`);
				}
				if (e.routeModifiers.avoidIndoor) {
					avoid.push(`indoor`);
				}
				text += avoid.join(", ");
				text += `)`;
			}

			references.push({
				value: e.uuid,
				label: text,
			});
		});

		// routePlacesMap

		routePlacesMap.map((e) => {
			let text = `${Pluralize(convertFromSnake(e.type))} along the ${
				travelMap[e.travelMode]
			} route from ${savedPlacesMap[e.origin].displayName.text} to ${
				savedPlacesMap[e.destination].displayName.text
			}`;

			if (
				e.routeModifiers.avoidTolls ||
				e.routeModifiers.avoidHighways ||
				e.routeModifiers.avoidFerries ||
				e.routeModifiers.avoidIndoor
			) {
				text += ` (Avoiding `;
				const avoid = [];
				if (e.routeModifiers.avoidTolls) {
					avoid.push(`tolls`);
				}
				if (e.routeModifiers.avoidHighways) {
					avoid.push(`highways`);
				}
				if (e.routeModifiers.avoidFerries) {
					avoid.push(`ferries`);
				}
				if (e.routeModifiers.avoidIndoor) {
					avoid.push(`indoor`);
				}
				text += avoid.join(", ");
				text += `)`;
			}

			text += `${
				e.minRating > 0
					? " with a minimum rating of " + e.minRating
					: ""
			}${
				e.priceLevels.length > 0
					? (e.minRating > 0 ? " and " : " ") +
					  "price levels " +
					  e.priceLevels.map((p) => priceMap[p]).join(" or ")
					: ""
			}${e.rankPreference === "DISTANCE" ? " (Rank by Distance)" : ""}`;

			references.push({
				value: e.uuid,
				label: text,
			});
		});

		setReferences(references);
	};
	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				References
				<Tooltip
					title={
						"References are the ground truth for the question. Choose references that are relevant to the question."
					}
				>
					<IconButton size="small">
						<InfoIcon />
					</IconButton>
				</Tooltip>
			</Typography>

			<FormControl variant="outlined" fullWidth required>
				{/* <InputLabel>References</InputLabel> */}
				<Select
					multiple
					required
					// label={"References"}
					placeholder="Choose references of the ground truth"
					id="outlined-adornment"
					className="outlined-input"
					value={
						(query.questions[index].relevant_api_calls ||
							query.questions[index].references) ??
						[]
					}
					onChange={(e) => {
						setQuery((prev) => {
							const newQuery = { ...prev };
							newQuery.questions[index].relevant_api_calls =
								e.target.value;
							return newQuery;
						});
					}}
					renderValue={(refs) => {
						console.log("References", refs);
						return (
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 0.5,
								}}
							>
								{refs.map((r, index) => (
									<Chip
										key={index}
										label={
											references.findIndex(
												(e) => e.value === r
											) + 1
										}
										size="small"
									/>
								))}
							</Box>
						);
					}}
				>
					{references.map((r, index) => (
						<MenuItem key={index} value={r.value}>
							<Typography
								className="max-w-[50rem]"
								sx={{
									whiteSpace: "normal", // Allows text to wrap
									wordWrap: "break-word", // Breaks long words
								}}
							>
								({index + 1}) {r.label}
							</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

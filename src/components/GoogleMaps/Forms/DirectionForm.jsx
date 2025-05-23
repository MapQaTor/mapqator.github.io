/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useContext, useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	Paper,
	Select,
	Switch,
	Typography,
} from "@mui/material";
import { Add, ArrowRight, ArrowRightAlt } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import TravelSelectionField from "@/mapServices/GoogleMaps/TravelSelectionField";
import PlaceSelectionField from "@/components/GoogleMaps/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";
import DepartureTimeField from "../../InputFields/DepartureTimeField";
import dayjs from "dayjs";
import { AppContext } from "@/contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import DirectionComponent from "../Embed/DirectionComponent";
import MultiRouteComponent from "../Embed/MultiRouteComponent";
import debounce from "lodash/debounce";
import MultiStopComponent from "../Embed/MultiStopComponent";
import mapServices from "@/tools/MapServices";

const avoidMap = {
	avoidTolls: "Tolls",
	avoidHighways: "Highways",
	avoidFerries: "Ferries",
};
const transitModeMap = {
	BUS: "Bus",
	LIGHT_RAIL: "Tram and Light rail",
	SUBWAY: "Subway",
	TRAIN: "Train",
	// RAIL: "Rail", // This is equivalent to a combination of SUBWAY, TRAIN, and LIGHT_RAIL.
};
export default function DirectionForm({
	handlePlaceAdd,
	newDirection,
	setNewDirection,
}) {
	const {
		selectedPlacesMap,
		directionInformation,
		setDirectionInformation,
		setApiCallLogs,
		savedPlacesMap,
		tools,
	} = useContext(GlobalContext);

	const [routes, setRoutes] = useState([]);
	const [apiCalls, setApiCalls] = useState([]);
	const [uuid, setUuid] = useState();
	const initialData = {
		origin: "",
		destination: "",
		intermediates: [],
		travelMode: "WALK",
		departureTime: {
			type: "now",
			date: dayjs(),
			time: dayjs(),
			departureTimestamp: new Date(),
		},
		optimizeWaypointOrder: false,
		transitPreferences: {
			allowedTravelModes: [],
		},
		routeModifiers: {
			avoidTolls: false,
			avoidHighways: false,
			avoidFerries: false,
		},
	};
	const [loading, setLoading] = useState(false);

	const [mapsApi, setMapsApi] = useState(null);

	const loadMapsApi = async () => {
		const mapsModule = await import(process.env.NEXT_PUBLIC_MAPS_API_PATH);
		console.log("Direction Maps Module", mapsModule.default);
		setMapsApi(mapsModule.default);
	};

	useEffect(() => {
		loadMapsApi();
	}, []);

	// { from, to, mode, routes: [{label, duration, distance, steps:[]}]}
	// useEffect(() => {
	// 	setNewDirection(initialData);
	// }, []);
	const handleDirectionAdd = async () => {
		if (newDirection.origin === "" || newDirection.destination === "")
			return;
		setLoading(true);
		if (routes.length > 0) {
			const newDirectionInfo = [...directionInformation];
			newDirectionInfo.push({
				origin: newDirection.origin,
				destination: newDirection.destination,
				intermediates: newDirection.intermediates,
				travelMode: newDirection.travelMode,
				optimizeWaypointOrder: newDirection.optimizeWaypointOrder,
				transitPreferences: newDirection.transitPreferences,
				routeModifiers: {
					avoidTolls: ["DRIVE", "TWO_WHEELER"].includes(
						newDirection.travelMode
					)
						? newDirection.routeModifiers.avoidTolls
						: false,
					avoidHighways: ["DRIVE", "TWO_WHEELER"].includes(
						newDirection.travelMode
					)
						? newDirection.routeModifiers.avoidHighways
						: false,
					avoidFerries: ["DRIVE", "TWO_WHEELER"].includes(
						newDirection.travelMode
					)
						? newDirection.routeModifiers.avoidFerries
						: false,
				},
				routes: routes,
				showSteps: true,
				uuid: uuid,
			});
			setApiCallLogs((prev) => [...prev, ...apiCalls]);
			setDirectionInformation(newDirectionInfo);
		} else {
			showError("Couldn't find directions between the two places");
		}
		setLoading(false);
	};

	const computeRoutes = async (data) => {
		// console.log("Computing routes", tools.computeRoutes.constructor);
		if (
			data.origin === "" ||
			data.destination === "" ||
			data.travelMode === ""
		)
			return;
		// Fetch the direction between the two places from google maps
		setLoading(true);
		const response = await tools.computeRoutes.run({
			origin: savedPlacesMap[data.origin],
			destination: savedPlacesMap[data.destination],
			intermediates: data.intermediates.map(
				(intermediate) => savedPlacesMap[intermediate]
			),
			travelMode: data.travelMode,
			routeModifiers: data.routeModifiers,
			optimizeWaypointOrder: data.optimizeWaypointOrder,
			computeAlternativeRoutes: data.computeAlternativeRoutes,
		});

		console.log("Compute Routes Response", response);
		if (response.success && response.data.result.routes) {
			setRoutes(response.data.result.routes);
			setApiCalls(response.data.apiCallLogs);
			setUuid(response.data.uuid);
		} else {
			showError("Couldn't find directions between the two places");
		}
		setLoading(false);
	};

	const debouncedComputeRoutes = useCallback(debounce(computeRoutes, 1000), [
		tools,
	]);
	useEffect(() => {
		debouncedComputeRoutes(newDirection);
	}, [newDirection, debouncedComputeRoutes]);

	return newDirection && tools.computeRoutes ? (
		<Box className="flex flex-col md:flex-row gap-4">
			<Box className="w-full md:w-1/2">
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<PlaceSelectionField
							label="Origin"
							value={newDirection.origin}
							onChange={(event) => {
								setNewDirection((prev) => ({
									...prev,
									origin: event.target.value,
								}));
							}}
							handlePlaceAdd={handlePlaceAdd}
						/>
					</Grid>
					<Grid item xs={12} className="flex justify-center">
						<IconButton
							onClick={() => {
								setNewDirection((prev) => ({
									...prev,
									origin: newDirection.destination,
									destination: newDirection.origin,
								}));
							}}
						>
							<FontAwesomeIcon
								icon={faRightLeft}
								style={{
									transform: "rotate(90deg)",
									color: "#000",
								}}
							/>
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<PlaceSelectionField
							label="Destination"
							value={newDirection.destination}
							onChange={(event) => {
								setNewDirection((prev) => ({
									...prev,
									destination: event.target.value,
								}));
							}}
							handlePlaceAdd={handlePlaceAdd}
						/>
					</Grid>

					<Grid item xs={12}>
						<tools.computeRoutes.TravelSelectionField
							mode={newDirection.travelMode}
							setMode={(value) =>
								setNewDirection((prev) => ({
									...prev,
									travelMode: value,
								}))
							}
						/>
					</Grid>
					<tools.computeRoutes.AvoidSelectionField
						form={newDirection}
						setForm={setNewDirection}
					/>

					<Box className="w-full p-3 pb-0 flex flex-row justify-start items-center gap-2">
						<Switch
							onChange={() => {
								setNewDirection((prev) => ({
									...prev,
									computeAlternativeRoutes:
										!prev.computeAlternativeRoutes,
								}));
							}}
							checked={newDirection.computeAlternativeRoutes}
							size="small"
							disabled={newDirection.intermediates.length > 0}
						/>
						<h6 className="text-base">
							Compute alternative routes
						</h6>
					</Box>

					{newDirection.travelMode !== "TRANSIT" && (
						<>
							<Grid item xs={12}>
								<FormControl fullWidth size="small" required>
									<InputLabel>Intermediates</InputLabel>
									<Select
										multiple
										value={newDirection.intermediates}
										onChange={(event) => {
											setNewDirection((prev) => ({
												...prev,
												intermediates:
													event.target.value,
											}));
										}}
										label={"Intermediates"}
										renderValue={(selected) =>
											!newDirection.optimizeWaypointOrder ? (
												<Box
													sx={{
														display: "flex",
														flexWrap: "wrap",
														gap: 0.5,
														alignItems: "center",
													}}
												>
													{selected.map(
														(value, index) => (
															<>
																<Typography variant="body2">
																	{
																		savedPlacesMap[
																			value
																		]
																			.displayName
																			.text
																	}
																</Typography>
																{index <
																	selected.length -
																		1 && (
																	<ArrowRightAlt />
																)}
															</>
														)
													)}
												</Box>
											) : (
												<Box
													sx={{
														display: "flex",
														flexWrap: "wrap",
														gap: 0.5,
													}}
												>
													{selected.map((value) => (
														<Chip
															key={value}
															label={
																savedPlacesMap[
																	value
																].displayName
																	?.text
															}
															size="small"
														/>
													))}
												</Box>
											)
										}
									>
										{Object.keys(savedPlacesMap).map(
											(place_id) => (
												<MenuItem
													key={place_id}
													value={place_id}
													className="flex flex-row gap-2"
												>
													<img
														src={
															mapServices[
																savedPlacesMap[
																	place_id
																].mapService
															].image
														}
														alt=""
														className="h-6"
													/>
													<Typography
														noWrap
														className="max-w-[26rem] truncate text-ellipsis"
													>
														{
															savedPlacesMap[
																place_id
															].displayName?.text
														}{" "}
														|{" "}
														<span className="text-gray-500">
															{
																savedPlacesMap[
																	place_id
																]
																	.shortFormattedAddress
															}
														</span>
													</Typography>
												</MenuItem>
											)
										)}
									</Select>
								</FormControl>
								<h6 className="px-2  text-xs">
									If your desired place is not listed here,
									you need to{" "}
									<a
										className="underline font-semibold cursor-pointer hover:text-blue-500"
										onClick={handlePlaceAdd}
									>
										add it
									</a>{" "}
									first.
								</h6>
							</Grid>
							<Box className="w-full p-3 pb-0 flex flex-row justify-start items-center gap-2">
								<Switch
									onChange={() => {
										setNewDirection((prev) => ({
											...prev,
											optimizeWaypointOrder:
												!prev.optimizeWaypointOrder,
										}));
									}}
									checked={newDirection.optimizeWaypointOrder}
									size="small"
									disabled={
										newDirection.intermediates.length < 2
									}
								/>
								<h6 className="text-base">
									Optimize intermediates order
								</h6>
							</Box>
						</>
					)}

					{/* {(newDirection.travelMode === "transit" ||
				newDirection.travelMode === "driving") && (
				<Grid item xs={12}>
					<DepartureTimeField
						value={newDirection.departureTime}
						onChange={(newValue) => {
							setNewDirection((prev) => ({
								...prev,
								departureTime: newValue,
							}));
						}}
					/>
				</Grid>
			)} */}
					{/* <Grid item xs={12}>
						<iframe
							width="100%"
							height="450"
							// style="border:0"
							style={{
								border: 0,
							}}
							loading="lazy"
							allowfullscreen
							referrerPolicy="no-referrer-when-downgrade"
							src={
								"https://www.google.com/maps/embed/v1/directions?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&path=g|~oCcftfPoBHIAQAsBCcA@WB?h@AXiCBCy@M}COgEKcJM_JCWf@I`Ba@pA_@dCq@|Ac@\\MtBo@v@Uf@Od@Md@MvFaBf@OfBi@lBm@lBi@bA[|@Wd@MtEqAt@ABGDGBCLED?RDp@SdBi@pBi@hCm@l@OtHoBPEf@MvBc@hBa@pB_@nCq@xAYNCPCf@Iz@K~@IbAKTGRAHARCz@C`@ApEF\\@`@@xAB`@B^@dALP@fANfC\\H@r@Fr@F|AH~ABjBBbC?`CG|BSLCZINOPCPFHH@DBVIRl@`@d@TRLvA]xBKvCQdD?fCAhABtB@xFAa@zDSdAe@nBADYnBKl@rARD?JBKCE?sASJm@XoB@Ed@oBXgBRqBFg@yF@uBAiACgC@mD?oCPs@FeABwA\\SMe@Um@a@OHM?GAOICGiHToFCcAAs@CyCSIAUCeCUgAKSGcACq@AK?qACaACkBK}CE{@B_@FUBm@HK@YBw@JG@eAH[DgARqHnB}@T}@N_Cf@OBmEdAwIrB}A^cA`@k@P@PADEHGHQFSCCCKKo@@m@L_B^sA\\]J_@P}Af@a@JqErAsA`@m@Ne@NcEjAk@Na@Jg@NqA^cBf@MDQHQHODQFkAZa@D]Fc@Le@P[Ja@JL`BFjBLhDF`D@n@FrC\\|IVCf@AnCBP@~@Ax@E"
							}
						/>
					</Grid> */}

					{newDirection.travelMode === "TRANSIT" && (
						<Grid item xs={12}>
							<FormControl fullWidth size="small">
								<InputLabel>Prefer</InputLabel>
								<Select
									// input={<OutlinedInput label="Tag" />}
									value={
										newDirection.transitPreferences
											.allowedTravelModes
									}
									onChange={(e) => {
										setNewDirection((prev) => ({
											...prev,
											transitPreferences: {
												allowedTravelModes:
													e.target.value,
											},
										}));
									}}
									label={"Prefer"}
									multiple
									renderValue={(selected) => {
										if (selected.length === 0) {
											return <em>Any</em>; // Custom label for empty array
										}
										return selected
											.map(
												(value) => transitModeMap[value]
											)
											.join(", ");
									}}
								>
									{Object.keys(transitModeMap).map((key) => (
										<MenuItem key={key} value={key}>
											<Checkbox
												checked={
													newDirection.transitPreferences.allowedTravelModes.indexOf(
														key
													) > -1
												}
											/>
											<ListItemText
												primary={transitModeMap[key]}
											/>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					)}

					<Grid item xs={12}>
						<LoadingButton
							variant="contained"
							fullWidth
							onClick={handleDirectionAdd}
							loading={loading}
							loadingPosition="start"
							startIcon={<Add />}
						>
							Add alternative routes
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
					{newDirection.origin === "" &&
					newDirection.destination === "" ? (
						<Box className="h-[387px] flex flex-row items-center justify-center">
							<h1
								// variant="body1"
								className="text-center p-4 text-xl text-zinc-400"
							>
								Select origin/destination to view route.
							</h1>
						</Box>
					) : newDirection.intermediates.length === 0 ? (
						<MultiRouteComponent
							height={"387px"}
							routes={routes}
							origin={savedPlacesMap[newDirection.origin]}
							destination={
								savedPlacesMap[newDirection.destination]
							}
						/>
					) : (
						<MultiStopComponent
							height={"387px"}
							routes={routes}
							origin={savedPlacesMap[newDirection.origin]}
							destination={
								savedPlacesMap[newDirection.destination]
							}
							intermediates={newDirection.intermediates.map(
								(intermediate) => savedPlacesMap[intermediate]
							)}
						/>
					)}
				</Paper>
			</Box>
		</Box>
	) : (
		<p className="text-center">No API Available</p>
	);
}

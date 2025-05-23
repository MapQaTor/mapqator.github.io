/* eslint-disable @next/next/no-img-element */
import {
	Box,
	Chip,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import PlaceSelectionField from "../InputFields/PlaceSelectionField";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/contexts/AppContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import mapApi from "@/api/mapApi";
import textualFields from "@/database/textualFields.json";
import { showError } from "@/contexts/ToastProvider";
import { list as placeDetailsTools } from "@/tools/PlaceDetails";
import mapServices from "@/tools/MapServices";
import { list as placeDetailsList } from "@/tools/PlaceDetails";

function UnsavedPlaceSelectionField({
	label,
	onChange,
	value,
	multiple,
	handlePlaceAdd,
}) {
	const { selectedPlacesMap, savedPlacesMap } = useContext(GlobalContext);
	return (
		<>
			<FormControl fullWidth size="small" required>
				<InputLabel>{label}</InputLabel>
				<Select
					value={value}
					onChange={onChange}
					label={label}
					renderValue={(selected) => (
						<Box className="flex flex-row gap-2">
							<img
								src={
									mapServices[
										savedPlacesMap[selected].mapService
									].image
								}
								alt=""
								className="h-6"
							/>
							<Typography noWrap>
								{savedPlacesMap[selected]?.displayName?.text}
							</Typography>
						</Box>
					)}
				>
					{Object.keys(savedPlacesMap)
						.filter((place_id) => !selectedPlacesMap[place_id])
						.map((place_id) => (
							<MenuItem
								key={place_id}
								value={place_id}
								className="flex flex-row gap-2"
							>
								<img
									src={
										mapServices[
											savedPlacesMap[place_id].mapService
										].image
									}
									alt=""
									className="h-6"
								/>
								<Typography
									noWrap
									className="max-w-[26rem] truncate text-ellipsis"
								>
									{savedPlacesMap[place_id].displayName?.text}{" "}
									|{" "}
									<span className="text-gray-500">
										{
											savedPlacesMap[place_id]
												.shortFormattedAddress
										}
									</span>
								</Typography>
							</MenuItem>
						))}
				</Select>
			</FormControl>
			<h6 className="px-2  text-xs">
				If your desired place is not listed here, you need to{" "}
				<a
					className="underline font-semibold cursor-pointer hover:text-blue-500"
					onClick={handlePlaceAdd}
				>
					add it
				</a>{" "}
				first.
			</h6>
		</>
	);
}
export default function PlacesForm({ handlePlaceAdd }) {
	const [placeId, setPlaceId] = useState();
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		setApiCallLogs,
		savedPlacesMap,
		tools,
		newPlaceId,
		setNewPlaceId,
		setTools,
	} = useContext(GlobalContext);
	const [loading, setLoading] = useState(false);

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

	const handleAddSave = async (place_id) => {
		setLoading(true);
		let details = savedPlacesMap[place_id];
		const res = await tools.placeDetails.fetch(details);
		if (res.success) {
			details = res.data.result;
			setSelectedPlacesMap((prev) => ({
				...prev,
				[place_id]: {
					...details,
					uuid: res.data.uuid,
					mapService: savedPlacesMap[place_id].mapService,
				},
			}));
			setApiCallLogs((prev) => [...prev, ...res.data.apiCallLogs]);
			setNewPlaceId(undefined);
		} else {
			showError(res.error);
			setLoading(false);
			return;
		}
		// handleAdd(details);
		setLoading(false);
	};

	useEffect(() => {
		if (
			newPlaceId &&
			tools.placeDetails.family !== savedPlacesMap[newPlaceId].mapService
		) {
			setTools((prev) => ({
				...prev,
				placeDetails:
					placeDetailsList[savedPlacesMap[newPlaceId].mapService][0]
						.instance,
			}));
		}
	}, [tools.placeDetails, newPlaceId]);

	return tools.placeDetails ? (
		<Box className="w-full md:w-[30rem] mx-auto">
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<UnsavedPlaceSelectionField
						label="Place"
						onChange={(event) => {
							const id = event.target.value;
							setNewPlaceId(event.target.value);
						}}
						value={newPlaceId}
						handlePlaceAdd={handlePlaceAdd}
					/>
				</Grid>
				<Grid item xs={12}>
					<LoadingButton
						variant="contained"
						fullWidth
						onClick={() => handleAddSave(newPlaceId)}
						startIcon={<Add />}
						loading={loading}
						loadingPosition="start"
						disabled={!newPlaceId || selectedPlacesMap[newPlaceId]}
					>
						Add Place
					</LoadingButton>
				</Grid>
			</Grid>
		</Box>
	) : (
		<p className="text-center">No API Available</p>
	);
}

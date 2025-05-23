/* eslint-disable @next/next/no-img-element */
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	Typography,
} from "@mui/material";
import PlaceDeleteButton from "../Buttons/PlaceDeleteButton";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
	Directions,
	RemoveRedEye,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import textualFields from "@/database/textualFields";
import mapApi from "@/api/mapApi";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { showError } from "@/contexts/ToastProvider";
import mapServices from "@/tools/MapServices";
import { list as placeDetailsTools } from "@/tools/PlaceDetails";
export default function SavedPlaceCard({ placeId, savedPlacesMap }) {
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		activeStep,
		setActiveStep,
		setNewNearbyPlaces,
		setNewDirection,
		setApiCallLogs,
		tools,
		setNewPlaceId,
		setSavedPlacesMap,
	} = useContext(GlobalContext);

	const [addingPlace, setAddingPlace] = useState(false);

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
		setAddingPlace(true);
		let details = savedPlacesMap[place_id];
		const res = await placeDetailsTools[
			savedPlacesMap[place_id].mapService
		][0].instance.run(details);
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
		} else {
			showError(res.error);
			setLoading(false);
			return;
		}
		// handleAdd(details);
		setActiveStep(2);
		setAddingPlace(false);
	};

	const handleAdd = (details) => {
		const place_id = details["id"];
		if (place_id === "" || selectedPlacesMap[place_id]) return;
		setSelectedPlacesMap((prev) => ({
			...prev,
			[place_id]: true,
		}));
	};

	return (
		<Card variant="outlined" className="h-full">
			<CardContent className="flex flex-col justify-between h-full gap-2">
				<div className="flex flex-col mb-2">
					<Typography variant="h6" component="div">
						{savedPlacesMap[placeId].displayName?.text}
					</Typography>
					<Typography color="textSecondary">
						{savedPlacesMap[placeId].shortFormattedAddress}
					</Typography>
				</div>
				<div className="flex justify-center gap-4 mt-auto">
					<Box
						className={"flex flex-col gap-1 items-center"}
						sx={{
							color: "primary.main",
						}}
					>
						<Button
							variant="outlined"
							onClick={() => {
								setNewDirection((prev) => ({
									...prev,
									destination: placeId,
								}));
								setActiveStep(4);
							}}
							sx={{
								borderRadius: "50%",
								height: "45px",
								width: "45px",
								minWidth: "45px",
								padding: 0,
							}}
						>
							<Directions />
						</Button>
						<Typography variant="body2">Directions</Typography>
					</Box>
					<Box
						className={"flex flex-col gap-1 items-center"}
						sx={{
							color:
								selectedPlacesMap[placeId] || addingPlace
									? "rgba(0,0,0,0.26)"
									: "primary.main",
						}}
					>
						<LoadingButton
							variant="outlined"
							onClick={() => {
								setNewPlaceId(placeId);
								setActiveStep(2);
							}}
							loading={addingPlace}
							disabled={selectedPlacesMap[placeId]}
							sx={{
								borderRadius: "50%",
								height: "45px",
								width: "45px",
								minWidth: "45px",
								padding: 0,
							}}
						>
							<BookmarkBorderIcon />
						</LoadingButton>
						<Typography variant="body2">Save</Typography>
					</Box>
					<Box
						className={"flex flex-col gap-1 items-center"}
						sx={{
							color: "primary.main",
						}}
					>
						<Button
							variant="outlined"
							onClick={() => {
								setNewNearbyPlaces((prev) => ({
									...prev,
									locationBias: placeId,
								}));
								setActiveStep(3);
							}}
							sx={{
								borderRadius: "50%",
								height: "45px",
								width: "45px",
								minWidth: "45px",
								padding: 0,
							}}
						>
							<ShareLocationIcon />
						</Button>
						<Typography variant="body2">Nearby</Typography>
					</Box>
				</div>
				<Divider />
				<Box className="flex flex-row justify-between items-center">
					<div className="flex flex-row gap-2 items-center">
						<IconButton
							onClick={() =>
								setSavedPlacesMap((prev) => ({
									...prev,
									[placeId]: {
										...prev[placeId],
										hidden: !prev[placeId].hidden,
									},
								}))
							}
						>
							{savedPlacesMap[placeId].hidden ? (
								<VisibilityOff />
							) : (
								<Visibility />
							)}
						</IconButton>
					</div>

					<div className="flex flex-row gap-2 items-center">
						<img
							src={
								mapServices[savedPlacesMap[placeId].mapService]
									.image
							}
							alt=""
							className="h-6"
						/>
						<PlaceDeleteButton placeId={placeId} />
					</div>
				</Box>
			</CardContent>
		</Card>
	);
}

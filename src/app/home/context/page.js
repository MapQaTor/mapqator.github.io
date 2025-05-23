"use client";
import { useContext, useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { AppContext } from "@/contexts/AppContext";
import example from "@/database/newexample.json";
import mapApi from "@/api/mapApi";
import dayjs from "dayjs";
import KeyStoreButton from "@/components/Buttons/KeyStoreButton";
import { useRouter, useSearchParams } from "next/navigation";
import ContextEditor from "@/components/GoogleMaps/ContextEditor";
export default function ContextGenerator() {
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		distanceMatrix,
		setDistanceMatrix,
		directionInformation,
		setDirectionInformation,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		poisMap,
		setPoisMap,
		setContext,
		currentInformation,
		setCurrentInformation,
		setContextStatus,
		queryStatus,
		activeStep,
		setActiveStep,
		savedPlacesMap,
		setSavedPlacesMap,
		setRoutePlacesMap,
	} = useContext(GlobalContext);

	useEffect(() => {
		const page = window.location.hash.substring(1);
		setActiveStep(page === "edit" ? 1 : 0);
	}, []);

	const searchParams = useSearchParams();
	// useEffect(() => {
	// 	if (queryStatus === "empty") {
	// 		router.push("/home");
	// 	}
	// }, [queryStatus]);

	const router = useRouter();
	const {
		initRoutePlacesMap,
		initSelectedPlacesMap,
		initNearbyPlacesMap,
		initPoisMap,
		initDistanceMatrix,
		initDirectionInformation,
		initCurrentInformation,
	} = useContext(GlobalContext);

	const handleReset = () => {
		setPoisMap(initPoisMap);
		setDistanceMatrix(initDistanceMatrix);
		setNearbyPlacesMap(initNearbyPlacesMap);
		setCurrentInformation(initCurrentInformation);
		setDirectionInformation(initDirectionInformation);
		setRoutePlacesMap(initRoutePlacesMap);
		setSelectedPlacesMap(initSelectedPlacesMap);
		setSavedPlacesMap({});
		setActiveStep(1);
		setContext([]);
	};

	// const handleStart = () => {
	// 	setSelectedPlacesMap(exampleSelectedPlacesMap);
	// 	setNearbyPlacesMap(exampleNearbyPlacesMap);
	// 	setPoisMap(examplePoisMap);
	// 	setDistanceMatrix(exampleDistanceMatrix);
	// 	setDirectionInformation(exampleDirectionInformation);
	// 	setCurrentInformation(exampleCurrentInformation);
	// };
	const onFinish = () => {
		setContextStatus("saved");

		const params = searchParams.toString();

		if (params) {
			router.push(`/home/question?${params}`);
		} else {
			router.push("/home/question");
		}
	};

	const handleSave = async (place_id) => {
		if (savedPlacesMap[place_id]) return;
		const res = await mapApi.getDetails(place_id);
		if (res.success) {
			const details = res.data.result;
			setSavedPlacesMap((prev) => ({
				...prev,
				[place_id]: details,
			}));
		} else {
			console.error("Error fetching data: ", res.error);
			return;
		}
	};

	const handleExample = () => {
		// setSelectedPlacesMap(exampleSelectedPlacesMap);
		// setNearbyPlacesMap(exampleNearbyPlacesMap);
		// setPoisMap(examplePoisMap);
		// setDistanceMatrix(exampleDistanceMatrix);
		// setDirectionInformation(exampleDirectionInformation);
		// setCurrentInformation(exampleCurrentInformation);
		// for (let place_id in example.places) {
		// 	await handleSave(place_id);
		// }
		setSavedPlacesMap(example.places ?? {});
		setSelectedPlacesMap(example.place_details ?? {});
		setDistanceMatrix(example.distance_matrix ?? {});
		setDirectionInformation(example.directions ?? {});
		setNearbyPlacesMap(example.nearby_places ?? {});
		setCurrentInformation(
			example.current_information
				? {
						time: example.current_information.time
							? dayjs(example.current_information.time)
							: null,
						day: example.current_information.day,
						location: example.current_information.location,
				  }
				: {
						time: null,
						day: "",
						location: "",
				  }
		);
		setPoisMap(example.pois ?? {});
		setContext({
			places: ContextGeneratorService.getPlacesContext(
				example.places ?? {},
				savedPlacesMap
			),
			nearby: ContextGeneratorService.getNearbyContext(
				example.nearby_places ?? {},
				savedPlacesMap
			),
			area: ContextGeneratorService.getAreaContext(
				example.pois ?? {},
				savedPlacesMap
			),
			distance: ContextGeneratorService.getDistanceContext(
				example.distance_matrix ?? {},
				savedPlacesMap
			),
			direction: ContextGeneratorService.getDirectionContext(
				example.directions ?? {},
				savedPlacesMap
			),
			params: ContextGeneratorService.getParamsContext(
				example.current_information
					? {
							time: example.current_information.time
								? dayjs(example.current_information.time)
								: null,
							day: example.current_information.day,
							location: example.current_information.location,
					  }
					: {
							time: null,
							day: "",
							location: "",
					  },
				savedPlacesMap
			),
		});
	};

	// useEffect(() => {
	// 	handleExample();
	// }, []);

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 4 }} className="flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl font-normal pb-2">
					Create Geo-Spatial Context Using Map Services
				</h1>
				<ContextEditor
					{...{
						handleReset,
						onFinish,
						handleExample,
						activeStep,
						setActiveStep,
					}}
				/>
				{/* <KeyStoreButton /> */}
			</Box>
		</Container>
	);
}

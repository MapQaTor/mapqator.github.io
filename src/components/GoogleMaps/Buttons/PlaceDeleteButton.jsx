import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import { showError } from "@/contexts/ToastProvider";

export default function PlaceDeleteButton({ placeId, isSelected }) {
	const {
		// Getters
		selectedPlacesMap,
		distanceMatrix,
		directionInformation,
		nearbyPlacesMap,
		routePlacesMap,
		poisMap,
		// Setters
		setDistanceMatrix,
		setDirectionInformation,
		setNearbyPlacesMap,
		setSelectedPlacesMap,
		setPoisMap,
		setApiCallLogs,
		savedPlacesMap,
		setSavedPlacesMap,
	} = useContext(GlobalContext);

	const deletePlaceFromDistanceMatrix = (place_id) => {
		const newDistanceMatrix = { ...distanceMatrix };
		delete newDistanceMatrix[place_id];
		Object.keys(newDistanceMatrix).forEach((key) => {
			delete newDistanceMatrix[key][place_id];
		});
		setDistanceMatrix(newDistanceMatrix);
	};

	const deletePlaceFromDirections = (place_id) => {
		setDirectionInformation((prev) =>
			prev.filter((direction) => direction.place_id !== place_id)
		);
	};

	const deletePlaceFromNearbyPlaces = (place_id) => {
		setNearbyPlacesMap((prev) =>
			prev.filter((entry) => entry.locationBias !== place_id)
		);
	};

	const deletePlaceFromPois = (place_id) => {
		const newPoisMap = { ...poisMap };
		delete newPoisMap[place_id];
		setPoisMap(newPoisMap);
	};

	const deletePlaceFromSaved = (place_id) => {
		const tmp = { ...savedPlacesMap };
		// First delete from apiCallLogs with same uuid
		const uuid = tmp[place_id].uuid;
		setApiCallLogs((prev) => prev.filter((log) => log.uuid !== uuid));
		delete tmp[place_id];
		setSavedPlacesMap(tmp);
	};

	const searchPlaceIdInMaps = (place_id) => {
		const selectedPlacesMapStr = JSON.stringify(selectedPlacesMap);
		const directionInformationStr = JSON.stringify(directionInformation);
		const nearbyPlacesMapStr = JSON.stringify(nearbyPlacesMap);
		const routePlacesMapStr = JSON.stringify(routePlacesMap);

		return (
			selectedPlacesMapStr.includes(place_id) ||
			directionInformationStr.includes(place_id) ||
			nearbyPlacesMapStr.includes(place_id) ||
			routePlacesMapStr.includes(place_id)
		);
	};

	const check = (place_id) => {};
	const deletePlace = (place_id) => {
		// deletePlaceFromDistanceMatrix(place_id);
		// deletePlaceFromDirections(place_id);
		// deletePlaceFromNearbyPlaces(place_id);
		// deletePlaceFromPois(place_id);
		// const newSelectedPlacesMap = { ...selectedPlacesMap };
		// delete newSelectedPlacesMap[place_id];
		// setSelectedPlacesMap(newSelectedPlacesMap);

		if (searchPlaceIdInMaps(place_id)) {
			showError("Place is in use");
			return;
		}
		deletePlaceFromSaved(place_id);
	};
	return (
		<IconButton onClick={() => deletePlace(placeId)}>
			<DeleteIcon color="error" />
		</IconButton>
	);
}

import React, { useContext } from "react";
import { Button } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import mapApi from "@/api/mapApi";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import { AppContext } from "@/contexts/AppContext";

export default function QueryEditButton({ onEdit, query }) {
	const {
		setSelectedPlacesMap,
		setDistanceMatrix,
		setNearbyPlacesMap,
		setCurrentInformation,
		setDirectionInformation,
		setContext,
		setQuery,
		setPoisMap,
		setApiCallLogs,
		setRoutePlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
		setMapService,
	} = useContext(GlobalContext);

	const handleEdit = async () => {
		// setMapService(query.context_json.map_service ?? "googleMaps");
		// // if (query.context_json.places) {
		// setSavedPlacesMap(query.context_json.places ?? {});
		// // } else {
		// // 	for (let place_id in query.context_json.place_details) {
		// // 		console.log("saving place_id", place_id);
		// // 		await handleSave(place_id);
		// // 	}
		// // }
		// setSelectedPlacesMap(query.context_json.place_details ?? {});
		// // setDistanceMatrix(query.context_json.distance_matrix ?? {});
		// setDirectionInformation(query.context_json.directions ?? []);
		// setNearbyPlacesMap(query.context_json.nearby_places ?? []);
		// setApiCallLogs(query.api_call_logs ?? []);
		// setRoutePlacesMap(query.context_json.route_places ?? []);
		// // setCurrentInformation(
		// // 	query.context_json.current_information
		// // 		? {
		// // 				time: query.context_json.current_information.time
		// // 					? dayjs(query.context_json.current_information.time)
		// // 					: null,
		// // 				day: query.context_json.current_information.day,
		// // 				location:
		// // 					query.context_json.current_information.location,
		// // 		  }
		// // 		: {
		// // 				time: null,
		// // 				day: "",
		// // 				location: "",
		// // 		  }
		// // );
		// // setPoisMap(query.context_json.pois ?? {});
		// setContext({
		// 	places: ContextGeneratorService.getPlacesContext(
		// 		query.context_json.places ?? {},
		// 		savedPlacesMap
		// 	),
		// 	nearby: ContextGeneratorService.getNearbyContext(
		// 		query.context_json.nearby_places ?? {},
		// 		savedPlacesMap
		// 	),
		// 	area: ContextGeneratorService.getAreaContext(
		// 		query.context_json.pois ?? {},
		// 		savedPlacesMap
		// 	),
		// 	// distance: ContextGeneratorService.getDistanceContext(
		// 	// 	query.context_json.distance_matrix ?? {},
		// 	// 	savedPlacesMap
		// 	// ),
		// 	direction: ContextGeneratorService.getDirectionContext(
		// 		query.context_json.directions ?? {},
		// 		savedPlacesMap
		// 	),
		// 	params: ContextGeneratorService.getParamsContext(
		// 		query.context_json.current_information
		// 			? {
		// 					time: query.context_json.current_information.time
		// 						? dayjs(
		// 								query.context_json.current_information
		// 									.time
		// 						  )
		// 						: null,
		// 					day: query.context_json.current_information.day,
		// 					location:
		// 						query.context_json.current_information.location,
		// 			  }
		// 			: {
		// 					time: null,
		// 					day: "",
		// 					location: "",
		// 			  },
		// 		savedPlacesMap
		// 	),
		// });
		// setQuery(query);
		onEdit(query.id);
	};

	return (
		<Button
			variant="contained"
			color="primary"
			startIcon={<Edit />}
			onClick={handleEdit}
		>
			Edit
		</Button>
	);
}

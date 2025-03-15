/* eslint-disable @next/next/no-img-element */
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	ExpandMore,
	KeyboardDoubleArrowDown,
	KeyboardDoubleArrowUp,
	Map,
} from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
// import { MapIcon } from "lucide-react";

import { list as textSearchList } from "@/tools/TextSearch";
import { list as placeDetailsList } from "@/tools/PlaceDetails";
import { list as nearbySearchList } from "@/tools/NearbySearch";
import { list as computeRoutesList } from "@/tools/ComputeRoutes";
import { list as searchAlongRouteList } from "@/tools/SearchAlongRoute";
import { IconButton } from "@mui/material";
import mapServices from "@/tools/MapServices";

const MapServiceSelector = () => {
	const {
		mapService,
		setMapService,
		setSavedPlacesMap,
		setSelectedPlacesMap,
		setNearbyPlacesMap,
		setDirectionInformation,
		setRoutePlacesMap,

		initSelectedPlacesMap,
		initNearbyPlacesMap,
		initDirectionInformation,
		initRoutePlacesMap,

		setContext,
		setActiveStep,

		setTools,
	} = useContext(GlobalContext);
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const reset = () => {
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
		setNearbyPlacesMap(initNearbyPlacesMap);
		setDirectionInformation(initDirectionInformation);
		setRoutePlacesMap(initRoutePlacesMap);
		setSelectedPlacesMap(initSelectedPlacesMap);
		setSavedPlacesMap({});
		setActiveStep(0);
		setContext([]);
	};

	return (
		<div className="border rounded-lg overflow-hidden mb-4">
			<button
				className="w-full p-4 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
				onClick={toggleExpand}
			>
				<div className="flex items-center">
					<Map className="mr-2" size={24} />
					<span className="text-xl font-bold mr-4">Map Service:</span>
					{mapService ? (
						<div className="flex items-center text-white bg-blue-500 p-2 rounded-full px-4">
							<img
								src={mapServices[mapService].image}
								alt={mapServices[mapService].name}
								className="w-6 h-6 mr-2"
							/>
							<span className="font-semibold">
								{mapServices[mapService].name}
							</span>
						</div>
					) : (
						<span className="text-gray-500">Not selected</span>
					)}
				</div>
				<IconButton
					sx={{
						transform: isExpanded
							? "rotate(180deg)"
							: "rotate(0deg)",
						transition: "0.3s",
					}}
				>
					<ExpandMore />
				</IconButton>
			</button>
			{isExpanded && (
				<div className="p-4">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{Object.entries(mapServices).map(([key, service]) => (
							<button
								key={key}
								className={`p-6 border rounded-lg flex flex-col items-center justify-center transition-colors ${
									mapService === key
										? "bg-blue-500 text-white"
										: "bg-white hover:bg-gray-100"
								}`}
								onClick={() => {
									// reset();
									setMapService(key);
									setIsExpanded(false); // Collapse after selection
								}}
							>
								<img
									src={service.image}
									alt={service.name}
									className="w-20 h-20 mb-2"
								/>
								<span className="text-lg font-semibold">
									{service.name}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MapServiceSelector;

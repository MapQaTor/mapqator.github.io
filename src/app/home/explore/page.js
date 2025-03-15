"use client";
import QueryCard from "@/components/Cards/SingleQueryCard";
import { GlobalContext } from "@/contexts/GlobalContext";
import examples from "@/database/examples.json";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function ExplorePage() {
	const router = useRouter();

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

	const handleEdit = async (query) => {
		setSavedPlacesMap(query.context_json.places ?? {});
		setSelectedPlacesMap(query.context_json.place_details ?? {});
		setDirectionInformation(query.context_json.directions ?? []);
		setNearbyPlacesMap(query.context_json.nearby_places ?? []);
		setRoutePlacesMap(query.context_json.route_places ?? []);
		setApiCallLogs(query.api_call_logs ?? []);
		setQuery(query);
		router.push("/home/review");
	};

	return (
		<Container maxWidth="md">
			<Box className="py-5">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<h1 className="text-3xl md:text-4xl font-normal pb-5 mr-auto">
						Example Queries
					</h1>
				</div>
				<div className="flex flex-col gap-5">
					{examples.map((query, index) => (
						<QueryCard
							key={index}
							entry={query}
							onEdit={handleEdit}
							mode="explore"
							index={index}
						/>
					))}
				</div>
			</Box>
		</Container>
	);
}

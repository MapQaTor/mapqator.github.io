import mapApi from "@/api/mapApi";
import { AppContext } from "@/contexts/AppContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import { useContext, useState } from "react";
import textualFields from "@/database/textualFields.json";
export default function PlaceAddButton({ place_id }) {
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
	} = useContext(GlobalContext);

	const [loading, setLoading] = useState(false);
	const handleAddSave = async (place_id) => {
		// let details = undefined;
		setLoading(true);
		let details = savedPlacesMap[place_id];
		if (details === undefined) {
			const res = await mapApi.getDetailsNew(place_id);
			if (res.success) {
				details = res.data;
				console.log(details);
				setSavedPlacesMap((prev) => ({
					...prev,
					[place_id]: details,
				}));
			} else {
				console.error("Error fetching data: ", res.error);
				showError(res.error);
				setLoading(false);
				return;
			}
		}
		// handleAdd(details);
		setLoading(false);
	};

	return (
		<LoadingButton
			startIcon={<Add />}
			onClick={() => handleAddSave(place_id)}
			disabled={savedPlacesMap[place_id]}
			loading={loading}
		>
			Add
		</LoadingButton>
	);
}

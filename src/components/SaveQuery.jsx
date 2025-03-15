// components/SaveQuery.jsx
import React, { useContext, useEffect, useState } from "react";
import {
	Button,
	Typography,
	Box,
	Snackbar,
	TextField,
	Modal,
} from "@mui/material";
import PromptDesigner from "./PromptDesigner";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { CopyAll, Download, Settings } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";

const SaveQuery = ({ query, onSave, onDiscard }) => {
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [queryName, setQueryName] = useState(query?.name || "");
	const [open, setOpen] = React.useState(false);

	const {
		setQuery,
		apiCallLogs,
		selectedPlacesMap,
		nearbyPlacesMap,
		directionInformation,
		routePlacesMap,
		savedPlacesMap,
	} = useContext(GlobalContext);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const handleSave = (e) => {
		e.preventDefault();
		onSave(queryName);
		// setShowSnackbar(true);
	};

	const handleDownload = () => {
		const jsonString = JSON.stringify(
			{
				...query,
				api_call_logs: apiCallLogs,
				context_json: {
					// places: savedPlacesMap,
					// place_details: selectedPlacesMap,
					// nearby_places: nearbyPlacesMap,
					// directions: directionInformation,
					// route_places: routePlacesMap,
					text_search: savedPlacesMap,
					place_details: selectedPlacesMap,
					nearby_search: nearbyPlacesMap,
					compute_routes: directionInformation,
					search_along_route: routePlacesMap,
				},
			},
			null,
			2
		);
		const blob = new Blob([jsonString], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = "dataset.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	const copyContext = () => {
		const textualContext = ContextGeneratorService.convertContextToText(
			savedPlacesMap,
			selectedPlacesMap,
			nearbyPlacesMap,
			directionInformation,
			routePlacesMap
		);
		alert(textualContext);
	};

	useEffect(() => {
		setQueryName(query?.name || "");
	}, [query]);

	return (
		<form
			className="p-4 bg-blue-50 rounded-lg w-full"
			onSubmit={handleSave}
		>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<PromptDesigner query={query} onClose={handleClose} />
			</Modal>

			<Typography variant="h6" gutterBottom>
				{query?.id === undefined ? "Save" : "Update"} this to dataset?
			</Typography>
			{/* <TextField
				required
				fullWidth
				label="Query Name"
				variant="outlined"
				value={queryName}
				onChange={(e) => setQueryName(e.target.value)}
				className="mb-3"
			/> */}
			<Box display="flex" className="gap-2" mt={2}>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					startIcon={<SaveIcon />}
				>
					Save {query?.id === undefined ? "" : "#" + query?.id}
				</Button>
				<Button
					// variant="outlined"
					color="primary"
					onClick={handleDownload}
					startIcon={<Download />}
					// className="mt-2"
				>
					Download
				</Button>
				<Button
					// variant="outlined"
					color="secondary"
					onClick={handleOpen}
					startIcon={<Settings />}
					// className="mt-2"
				>
					Prompt
				</Button>
			</Box>
			{/* <Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={showSnackbar}
				autoHideDuration={3000}
				onClose={() => setShowSnackbar(false)}
				message="Query saved successfully!"
			/> */}
		</form>
	);
};

export default SaveQuery;

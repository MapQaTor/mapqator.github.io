import React, { useContext, useState } from "react";
import {
	Box,
	Button,
	Divider,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import {
	Add,
	ArrowBack,
	ArrowForward,
	Clear,
	Delete,
	ExpandMore,
	KeyboardDoubleArrowRight,
	Save,
	Send,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import OptionsEditor from "../InputFields/OptionsEditor";
import CategorySelectionField from "../InputFields/CategorySelectionField";
import CorrectAnswerEditor from "../InputFields/CorrectAnswerEditor";
import QuestionEditor from "../InputFields/QuestionEditor";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useAuth } from "@/contexts/AuthContext";
import SaveQuery from "../SaveQuery";
import LoginPrompt from "../LoginPrompts";
import config from "@/config/config";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { AppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import queryApi from "@/api/queryApi";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import ReferenceSelectionField from "../GoogleMaps/InputFields/ReferenceSelectionField";

function QACard({ index }) {
	const [expanded, setExpanded] = useState(true);
	const {
		query,
		setQuery,
		initQuery,
		context,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		directionInformation,
		distanceMatrix,
		currentInformation,
		setQueryStatus,
		routePlacesMap,
		apiCallLogs,
		savedPlacesMap,
		mapService,
	} = useContext(GlobalContext);
	return (
		<Paper
			elevation={2}
			sx={{ p: 3 }}
			key={index}
			className="w-full flex flex-col gap-4"
		>
			<div className="flex flex-row justify-between items-center">
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Question {index + 1}:
				</Typography>
				<IconButton
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "0.3s",
					}}
					onClick={() => setExpanded((prev) => !prev)}
				>
					<ExpandMore />
				</IconButton>
			</div>

			{expanded && (
				<>
					<QuestionEditor index={index} />
					<CategorySelectionField index={index} />
					<Divider />
					<CorrectAnswerEditor index={index} />
					<ReferenceSelectionField
						{...{
							index,
							apiCallLogs,
							savedPlacesMap,
							selectedPlacesMap,
							nearbyPlacesMap,
							directionInformation,
							routePlacesMap,
						}}
					/>
				</>
			)}

			<Box className="flex flex-row justify-end">
				<IconButton
					onClick={() =>
						setQuery((prev) => {
							const newQuery = { ...prev };
							newQuery.questions.splice(index, 1);
							return newQuery;
						})
					}
				>
					<Delete
						color="error"
						sx={{
							fontSize: 32,
						}}
					/>
				</IconButton>
			</Box>
		</Paper>
	);
}
export default function QuestionAnswerForm({ handleSubmit, handleReset }) {
	const {
		query,
		setQuery,
		initQuery,
		context,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		directionInformation,
		distanceMatrix,
		currentInformation,
		setQueryStatus,
		routePlacesMap,
		apiCallLogs,
		savedPlacesMap,
		mapService,
	} = useContext(GlobalContext);
	const router = useRouter();
	const { queries, setQueries } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const { isAuthenticated } = useAuth();

	const handleNext = () => {
		router.push("/home/review");
	};

	const handlePrevious = () => {
		router.push("/home/context");
	};

	const handleSave = async (queryName) => {
		const newQuery = {
			...query,
			name: queryName,
			context: ContextGeneratorService.convertContextToText(context),
			context_json: {
				places: savedPlacesMap,
				// distance_matrix: distanceMatrix,
				place_details: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				// current_information: currentInformation,
				// pois: poisMap,
				directions: directionInformation,
				route_places: routePlacesMap,
				map_service: mapService,
			},
			api_call_logs: apiCallLogs,
		};

		if (query.id === undefined) {
			const res = await queryApi.createNewQuery(newQuery);
			if (res.success) {
				// update the queries
				showSuccess("Query saved successfully");
				console.log(res.data);
				const newQueries = [...queries];
				newQueries.unshift(res.data[0]);
				setQueries(newQueries);
				setQuery((prev) => ({
					...prev,
					id: res.data[0].id,
				}));
				// handleDiscard();
				// router.push("/home/my-dataset");
			} else {
				showError("Can't save this query");
				// window.scrollTo(0, 0);
			}
		} else {
			const res = await queryApi.updateNewQuery(query.id, newQuery);
			if (res.success) {
				setQueries((prev) =>
					prev.map((q) => (q.id === res.data[0].id ? res.data[0] : q))
				);
				// update the queries
				showSuccess("Query edited successfully");
				// handleDiscard();
				// router.push("/home/my-dataset");
			} else {
				showError("Can't update this query");
				// window.scrollTo(0, 0);
			}
		}
		// handleSubmit();
		setQueryStatus("saved");
		window.scrollTo(0, document.body.scrollHeight);
	};

	const handleLogin = () => {
		router.push(config.logoutRedirect);
	};

	const handleDiscard = () => {
		setQuery({
			questions: [initQuery],
		});
	};

	return (
		<Box
			// onSubmit={async (e) => {

			// }}
			className="flex flex-col items-center gap-6"
		>
			{query.questions.map((question, index) => (
				<QACard index={index} key={index} />
			))}

			<Button
				variant="contained"
				color="primary"
				startIcon={<Add />}
				onClick={() => {
					setQuery((prev) => ({
						...prev,
						questions: [...prev.questions, initQuery],
					}));
					// window.scrollTo(0, document.body.scrollHeight);
				}}
			>
				Add question
			</Button>

			{/* {isAuthenticated ? (
				<SaveQuery
					query={query}
					onSave={handleSave}
					onDiscard={handleDiscard}
				/>
			) : (
				<LoginPrompt onLogin={handleLogin} />
			)} */}
		</Box>
	);
}

"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import gptApi from "@/api/gptApi";
import { motion, AnimatePresence } from "framer-motion";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Chip,
	CircularProgress,
	Grid,
	Avatar,
	LinearProgress,
	Button,
	Container,
	Paper,
	Divider,
	IconButton,
} from "@mui/material";
import ContextPreview from "@/components/GoogleMaps/ContextPreview";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import config from "@/config/config";
import queryApi from "@/api/queryApi";
import { AppContext } from "@/contexts/AppContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import EditIcon from "@mui/icons-material/Edit";
import Confirmation from "@/components/Dialogs/Confirmation";
import geminiApi from "@/api/geminiApi";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowBack, ArrowForward, ExpandMore } from "@mui/icons-material";
import OptionsPreview from "@/components/Lists/OptionsPreview";
import SaveQuery from "@/components/SaveQuery";
import LoginPrompt from "@/components/LoginPrompts";
import StepIndicator from "@/components/StepIndicator";

// const SaveQuery = ({ onSave, onDiscard }) => {
// 	const [showSnackbar, setShowSnackbar] = useState(false);

// 	const handleSave = () => {
// 		onSave();
// 		setShowSnackbar(true);
// 	};

// 	return (
// 		<Box className="mt-4 p-4 bg-blue-50 rounded-lg">
// 			<Typography variant="h6" gutterBottom>
// 				Save this query?
// 			</Typography>
// 			<Box display="flex" className="gap-2" mt={2}>
// 				<Button
// 					variant="contained"
// 					color="primary"
// 					onClick={handleSave}
// 					startIcon={<SaveIcon />}
// 				>
// 					Save
// 				</Button>
// 				<Button
// 					variant="outlined"
// 					color="error"
// 					onClick={onDiscard}
// 					startIcon={<DeleteIcon />}
// 				>
// 					Discard
// 				</Button>
// 			</Box>
// 		</Box>
// 	);
// };

// const LoginPrompt = ({ onLogin }) => {
// 	return (
// 		<Box className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
// 			<LockIcon className="text-gray-500 mb-2" fontSize="large" />
// 			<Typography variant="h6" gutterBottom>
// 				Want to save this query?
// 			</Typography>
// 			<Typography variant="body2" gutterBottom>
// 				Log in to save your query for future reference.
// 			</Typography>
// 			<Button
// 				variant="contained"
// 				color="primary"
// 				onClick={onLogin}
// 				startIcon={<LockIcon />}
// 			>
// 				Log In to Save
// 			</Button>
// 		</Box>
// 	);
// };

export default function Summary() {
	const {
		query,
		initQuery,
		setQuery,
		context,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		directionInformation,
		distanceMatrix,
		currentInformation,
		routePlacesMap,
		savedPlacesMap,
	} = useContext(GlobalContext);

	const { llmResults, setLlmResults, apiCallLogs } =
		useContext(GlobalContext);
	const { isAuthenticated } = useAuth();
	const { setEvaluationStatus, queryStatus, setQueryStatus } =
		useContext(GlobalContext);
	const { queries, setQueries } = useContext(AppContext);
	const [contextExpanded, setContextExpanded] = useState(false);

	// useEffect(() => {
	// 	if (queryStatus === "empty") {
	// 		router.push("/home");
	// 	}
	// }, [queryStatus]);

	const router = useRouter();

	const handleLogin = () => {
		router.push(config.logoutRedirect);
	};
	const searchParams = useSearchParams();

	const handleContextEdit = () => {
		const params = searchParams.toString();
		if (params) {
			router.push(`/home/context?${params}`);
		} else {
			router.push("/home/context");
		}
	};
	const handlePrevious = () => {
		const params = searchParams.toString();
		if (params) {
			router.push(`/home/question?${params}`);
		} else {
			router.push("/home/question");
		}
	};

	const handleSave = async (queryName) => {
		const newQuery = {
			...query,
			name: queryName,
			context: ContextGeneratorService.convertContextToText(
				savedPlacesMap,
				selectedPlacesMap,
				nearbyPlacesMap,
				directionInformation,
				routePlacesMap
			),
			context_json: {
				places: savedPlacesMap,
				// distance_matrix: distanceMatrix,
				place_details: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				// current_information: currentInformation,
				// pois: poisMap,
				directions: directionInformation,
				route_places: routePlacesMap,
				// map_service: mapService,
			},
			api_call_logs: apiCallLogs,
		};

		const params = new URLSearchParams(searchParams.toString());

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
				handleReset();
				// params.set("id", res.data[0].id);
				// router.push(`?${params.toString()}`);
				// handleDiscard();
				router.push("/home/my-dataset");
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
				handleReset();
				// update the queries
				showSuccess("Query edited successfully");
				// handleDiscard();
				router.push("/home/my-dataset");
			} else {
				showError("Can't update this query");
				// window.scrollTo(0, 0);
			}
		}
		// handleSubmit();
		// setQueryStatus("saved");
		// window.scrollTo(0, document.body.scrollHeight);
	};

	const handleDiscard = () => {
		setQuery({
			questions: [initQuery],
		});
	};

	const [open, setOpen] = useState(false);
	const handleEditQuestion = () => {
		const params = searchParams.toString();
		if (params) {
			router.push(`/home/question?${params}`);
		} else {
			router.push("/home/question");
		}
	};

	// useEffect(() => {
	// 	// Update "context" in the query object
	// 	const contextText = ContextGeneratorService.convertContextToText(
	// 		savedPlacesMap,
	// 		selectedPlacesMap,
	// 		nearbyPlacesMap,
	// 		directionInformation,
	// 		routePlacesMap
	// 	);

	// 	setQuery((prev) => ({
	// 		...prev,
	// 		context: contextText,
	// 		context_json: {
	// 			places: savedPlacesMap,
	// 			place_details: selectedPlacesMap,
	// 			nearby_places: nearbyPlacesMap,
	// 			directions: directionInformation,
	// 			route_places: routePlacesMap,
	// 		},
	// 	}));
	// }, []);

	const {
		initRoutePlacesMap,
		initSelectedPlacesMap,
		initNearbyPlacesMap,
		initPoisMap,
		initDistanceMatrix,
		initDirectionInformation,
		initCurrentInformation,

		setRoutePlacesMap,
		setSelectedPlacesMap,
		setNearbyPlacesMap,
		setDirectionInformation,
		setSavedPlacesMap,
		setActiveStep,
		setContext,
	} = useContext(GlobalContext);

	const handleReset = () => {
		setNearbyPlacesMap(initNearbyPlacesMap);
		setDirectionInformation(initDirectionInformation);
		setRoutePlacesMap(initRoutePlacesMap);
		setSelectedPlacesMap(initSelectedPlacesMap);
		setSavedPlacesMap({});
		setQuery(initQuery);
		setActiveStep(1);
		setContext([]);
	};

	const handleNext = () => {
		handleReset();
		router.push("/home/context");
	};

	return (
		<Container maxWidth="md">
			<Box sx={{ my: 4 }} className="flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl font-normal pb-2">
					Review and Save to Dataset
				</h1>
				<Confirmation
					open={open}
					setOpen={setOpen}
					onConfirm={() => {
						handleDiscard();
					}}
					text="Your query and evaluation will be lost. Are you sure you want to discard?"
				/>

				<Paper elevation={2} sx={{ p: 3 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
						mb={2}
					>
						<Box display="flex" alignItems="center">
							<Avatar
								className="mr-2"
								sx={{ backgroundColor: "#3b82f6" }}
							>
								<DescriptionIcon />
							</Avatar>
							<Typography variant="h6">Context</Typography>
						</Box>
						<Button
							startIcon={<EditIcon />}
							onClick={handleContextEdit}
						>
							Edit Context
						</Button>
					</Box>
					<Divider sx={{ my: 2 }} />
					<Box>
						{Object.keys(savedPlacesMap).length > 0 ? (
							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								<div
									className="flex justify-center flex-row items-center cursor-pointer"
									onClick={() =>
										setContextExpanded((prev) => !prev)
									}
								>
									<h1 className="font-bold p-2">
										{contextExpanded
											? "Summarize Context"
											: "Visualize Context"}
									</h1>
									<IconButton
										// sx={{ height: "2rem", width: "2rem" }}

										sx={{
											transform: contextExpanded
												? "rotate(180deg)"
												: "rotate(0deg)",
											transition: "0.3s",
										}}
									>
										<ExpandMore />
									</IconButton>
								</div>

								{contextExpanded ? (
									<>
										<Divider
											sx={{
												mt: 2,
											}}
										/>
										<ContextPreview
											savedPlacesMap={savedPlacesMap}
											selectedPlacesMap={
												selectedPlacesMap
											}
											nearbyPlacesMap={nearbyPlacesMap}
											directionInformation={
												directionInformation
											}
											routePlacesMap={routePlacesMap}
										/>
									</>
								) : (
									<>
										<Divider
											sx={{
												mt: 2,
											}}
										/>
										<Box className="mt-2">
											{ContextGeneratorService.summarizeContext(
												savedPlacesMap,
												selectedPlacesMap,
												nearbyPlacesMap,
												directionInformation,
												routePlacesMap
											).map((r, index) => (
												<Typography key={index}>
													({index + 1}) {r.label}
												</Typography>
											))}
										</Box>
									</>
								)}
							</Paper>
						) : (
							<p className="text-center py-2 my-auto text-base md:text-lg text-zinc-400">
								No information added.
							</p>
						)}
					</Box>
				</Paper>

				<Card elevation={2} className="w-full bg-green-50">
					<CardContent>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={2}
						>
							<Box display="flex" alignItems="center">
								<Avatar
									className="mr-2"
									sx={{ backgroundColor: "#22c55e" }}
								>
									<QuestionMarkIcon />
								</Avatar>
								<Typography variant="h6">Questions</Typography>
							</Box>
							<Button
								// variant="outlined"
								color="primary"
								startIcon={<EditIcon />}
								onClick={handleEditQuestion}
							>
								Edit Question
							</Button>
						</Box>
						<Divider sx={{ my: 2 }} />
						<div className="flex flex-col gap-4">
							<div>
								<Typography variant="h6" gutterBottom>
									Question:
								</Typography>
								<Paper
									elevation={1}
									sx={{ p: 2, bgcolor: "grey.100" }}
								>
									<Box sx={{ mb: 2 }}>
										<h6
											className={`${"whitespace-pre-line"}`}
										>
											{query.question}
										</h6>
									</Box>
									{query.answer && (
										<OptionsPreview answer={query.answer} />
									)}

									{/* <LLMAnswers entry={entry} index={i} /> */}
								</Paper>
							</div>
						</div>
					</CardContent>
				</Card>

				{isAuthenticated ? (
					<SaveQuery
						query={query}
						onSave={handleSave}
						onDiscard={handleDiscard}
					/>
				) : (
					<LoginPrompt onLogin={handleLogin} />
				)}

				<Divider className="w-full mb-4" />
				<Box className="flex flex-row gap-4 w-full justify-between items-end">
					<div className="w-1/3">
						<Button
							onClick={handlePrevious}
							startIcon={<ArrowBack />}
							color="primary"
							variant="contained"
						>
							Prev
						</Button>
					</div>

					<div className="flex flex-col items-center w-1/3">
						<StepIndicator currentStep={3} totalSteps={3} />
						<span className="text-sm text-gray-500 mt-1">
							Step 3 of 3
						</span>
					</div>
					<div className="w-1/3 flex justify-end">
						<Button
							onClick={handleNext}
							endIcon={<ArrowForward />}
							color="primary"
							variant="contained"
						>
							Start New
						</Button>
					</div>
				</Box>
			</Box>
		</Container>
	);
}

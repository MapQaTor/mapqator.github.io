"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	Button,
	Paper,
	Divider,
	Container,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import { getUserName } from "@/api/base";
import QuestionForm from "@/components/Forms/QuestionForm";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { useAuth } from "@/contexts/AuthContext";
import { AppContext } from "@/contexts/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionAnswerForm from "@/components/Forms/SingleQuestionAnswerForm";
import {
	ArrowBack,
	ArrowForward,
	Assessment,
	Clear,
	ExpandMore,
} from "@mui/icons-material";
import ContextPreview from "@/components/GoogleMaps/ContextPreview";
import StepIndicator from "@/components/StepIndicator";

export default function QuestionCreationPage() {
	const {
		context,
		query,
		setQuery,
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		currentInformation,
		poisMap,
		directionInformation,
		initQuery,
		contextStatus,
		queryStatus,
		setQueryStatus,
		routePlacesMap,
		savedPlacesMap,
	} = useContext(GlobalContext);

	const router = useRouter();
	const { queries, setQueries } = useContext(AppContext);
	const { isAuthenticated } = useAuth();
	const searchParams = useSearchParams();

	// useEffect(() => {
	// 	if (contextStatus === "empty") {
	// 		router.push("/home");
	// 	}
	// }, [contextStatus]);

	const handleNext = () => {
		const params = searchParams.toString();
		setQueryStatus("saved");
		if (params) {
			router.push(`/home/review?${params}`);
		} else {
			router.push("/home/review");
		}
	};

	const handlePrevious = () => {
		const params = searchParams.toString();
		if (params) {
			router.push(`/home/context?${params}`);
		} else {
			router.push("/home/context");
		}
	};

	const handleContextEdit = () => {
		const params = searchParams.toString();
		if (params) {
			router.push(`/home/context?${params}`);
		} else {
			router.push("/home/context");
		}
	};

	const onFinish = () => {
		router.push("/home/evaluation");
		setQueryStatus("saved");
	};

	const handleReset = () => {
		setQuery(initQuery);
		setQueryStatus("empty");
		// router.push("/home");
	};

	const [contextExpanded, setContextExpanded] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setQueryStatus("saved");
		onFinish();
	};

	return (
		<Container
			maxWidth="md"
			// sx={{ mt: 4, mb: 4 }}
			className="min-h-screen"
		>
			<Box sx={{ my: 4 }} className="flex flex-col gap-6">
				<h1 className="text-3xl md:text-4xl font-normal pb-2">
					Create QA Pair based on the Context
				</h1>
				<Paper elevation={2} sx={{ p: 3 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography variant="h6">Context:</Typography>
						<Button
							startIcon={<EditIcon />}
							onClick={handleContextEdit}
						>
							Edit Context
						</Button>
					</Box>
					<Divider sx={{ my: 2 }} />
					<Box>
						{/* <CollapsedContext
							context={ContextGeneratorService.convertContextToText(
								context
							)}
						/> */}

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

				<QuestionAnswerForm
					handleSubmit={handleSubmit}
					handleReset={handleReset}
				/>

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
						<StepIndicator currentStep={2} totalSteps={3} />
						<span className="text-sm text-gray-500 mt-1">
							Step 2 of 3
						</span>
					</div>

					<div className="flex flex-row gap-4 w-1/3 justify-end">
						<Button
							onClick={() => {
								handleReset();
							}}
							startIcon={<Clear />}
							color="error"
						>
							Clear
						</Button>
						<Button
							variant="contained"
							color="primary"
							endIcon={<ArrowForward />}
							// loading={loading}
							loadingPosition="start"
							onClick={handleNext}
						>
							{query.id === undefined
								? "Next"
								: "Next #" + query.id}
						</Button>
					</div>
				</Box>
				{/* {queries.filter((item) => item.username === getUserName()).length >
				0 && (
				<>
					<Divider sx={{ my: 4 }} />
					<div id="questions">
						<QuestionsContainer
							title="My Questions"
							isPersonal={true}
							onEdit={() => window.scrollTo(0, 0)}
						/>
					</div>
				</>
			)} */}
				{/* {queryStatus === "saved" && (
					<Box
						// mt={3}
						// p={2}
						// bgcolor="background.paper"
						borderRadius={1}
						className="mt-4 p-4 bg-blue-50 rounded-lg w-full"
					>
						<Typography variant="h6" gutterBottom>
							Would you like to evaluate this query with LLMs?
						</Typography>
						<Box display="flex" className="gap-2" mt={1}>
							<Button
								onClick={onFinish}
								variant="contained"
								color="primary"
								startIcon={<Assessment />}
							>
								Evaluate
							</Button>
							<Button
								onClick={() => handleReset()}
								variant="outlined"
							>
								No, thanks
							</Button>
						</Box>
					</Box>
				)} */}
			</Box>
		</Container>
	);
}

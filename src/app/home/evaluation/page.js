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
} from "@mui/material";
import ContextPreview from "@/components/Cards/ContextPreview";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LoginPrompt from "@/components/LoginPrompts";
import { useAuth } from "@/contexts/AuthContext";
import SaveQuery from "@/components/SaveQuery";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import queryApi from "@/api/queryApi";
import { AppContext } from "@/contexts/AppContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import EditIcon from "@mui/icons-material/Edit";
import Confirmation from "@/components/Dialogs/Confirmation";
import geminiApi from "@/api/geminiApi";
import { getUserName } from "@/api/base";
import { Save } from "@mui/icons-material";
import evaluationApi from "@/api/evaluationApi";

const llmApis = {
	gpt4: {
		id: 6,
		name: "GPT-4",
		func: gptApi.askGPTLive,
	},
	// geminiPro: {
	// 	id: 7,
	// 	name: "Gemini 1.0 Pro",
	// 	func: geminiApi.askGeminiLive,
	// },
};

const n_stages = Object.keys(llmApis).length + 2;
export default function LiveEvaluation() {
	// return;
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
		setQueryStatus,
	} = useContext(GlobalContext);
	const [stage, setStage] = useState(0);
	const { llmResults, setLlmResults } = useContext(GlobalContext);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const { isAuthenticated } = useAuth();
	const { setEvaluationStatus, queryStatus, savedPlacesMap } =
		useContext(GlobalContext);
	const { queries, setQueries } = useContext(AppContext);

	// useEffect(() => {
	// 	if (queryStatus === "empty") {
	// 		router.push("/home");
	// 	}
	// }, [queryStatus]);

	const extractJSON = (s) => {
		const match = s.match(/{.*?}/);
		try {
			return JSON.parse(match[1]);
		} catch (e) {
			return null;
		}
	};

	const extract = (s) => {
		for (let char of s) {
			if (/\d/.test(char)) {
				return char;
			}
		}
		return null;
	};

	const extractSubstringInParentheses = (s) => {
		const match = s.match(/\(([^)]+)\)/);
		return match ? match[1] : null;
	};

	const evaluateLLM = async (llm, llmFunction) => {
		console.log("Hit Evaluate");
		const res = await llmFunction(
			ContextGeneratorService.convertContextToText(context),
			{
				questions: query.questions,
			}
		);
		if (res.success && res.data.length > 0) {
			console.log("LLM response", res.data);
			const answers = [];
			for (let i = 0; i < res.data.length; i++) {
				const option = extract(res.data[i]);
				const explanation = extractSubstringInParentheses(res.data[i]);
				const verdict =
					parseInt(option) - 1 === query.questions[i].answer.correct
						? "right"
						: "wrong";

				console.log("LLM JSON", {
					answer: res.data[i],
					option,
					explanation,
					verdict,
				});
				answers.push({
					answer: res.data[i],
					option,
					explanation,
					verdict,
				});
			}

			console.log("answers", answers);

			setLlmResults((prev) => ({
				...prev,
				[llm]: answers,
			}));
		}
	};

	const router = useRouter();

	const handleLogin = () => {
		router.push(config.logoutRedirect);
	};

	const runEvaluation = async () => {
		setStage(0);
		console.log("Evaluation Run");
		let s = 2;
		if (Object.keys(llmResults).length === 0) {
			setLlmResults({});
			setStage(1);
			setIsProcessing(true);
			for (const [name, entry] of Object.entries(llmApis)) {
				await evaluateLLM(name, entry.func);
				setStage(s);
				s = s + 1;
			}
			setIsProcessing(false);
		}
		setStage(n_stages);
		setShowLoginPrompt(true);
		setEvaluationStatus("evaluated");
	};

	useEffect(() => {
		runEvaluation();
	}, [query, context]);

	const handleReset = () => {
		setQuery((prev) => ({
			questions: [initQuery],
			context: prev.context,
			context_json: prev.context_json,
		}));
		setQueryStatus("empty");
		setLlmResults({});
	};

	const handleSave = async () => {
		const newQuery = {
			...query,
			context: ContextGeneratorService.convertContextToText(context),
			context_json: {
				places: savedPlacesMap,
				// distance_matrix: distanceMatrix,
				place_details: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				// current_information: currentInformation,
				// pois: poisMap,
				directions: directionInformation,
			},
			evaluation: Object.entries(llmResults).map(([llm, result]) => ({
				model_id: llmApis[llm].id,
				model: llmApis[llm].name,
				answer: result.answer,
				verdict: result.verdict,
			})),
		};

		const res = await evaluationApi.insertNewResult(
			Object.entries(llmResults).map(([llm, result]) => ({
				model_id: llmApis[llm].id,
				query_id: query.id,
				responses: result,
				type: 0,
			}))
		);

		if (res.success) {
			// setQueries((prev) =>
			// 	prev.map((q) => (q.id === query.id ? res.data[0] : q))
			// );
			// update the queries
			showSuccess("Query edited successfully");
			router.push("/home/my-dataset");
			handleReset();
		} else {
			showError("Can't update this query");
			// window.scrollTo(0, 0);
		}
	};

	const handleDiscard = () => {
		console.log("Discarding query");
		// setShowSavePrompt(false);
		handleReset();
		router.push("/home");
	};

	const [open, setOpen] = useState(false);
	const handleEditQuestion = () => {
		router.push("/home/question");
	};

	return (
		<Container maxWidth="md">
			<Box className="h-full flex flex-col justify-center p-4 w-full pt-10">
				<Confirmation
					open={open}
					setOpen={setOpen}
					onConfirm={() => {
						handleDiscard();
					}}
					text="Your evaluation will be lost. Are you sure you want to discard?"
				/>
				<LinearProgress
					variant="determinate"
					value={(stage / n_stages) * 100}
					className="mb-4"
				/>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<Card elevation={3} className="mb-4 w-full bg-blue-50">
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
										sx={{ backgroundColor: "#3b82f6" }}
									>
										<DescriptionIcon />
									</Avatar>
									<Typography variant="h6">
										Context
									</Typography>
								</Box>
								<Button
									variant="outlined"
									color="primary"
									startIcon={<EditIcon />}
									onClick={() => router.push("/home/context")}
								>
									Edit
								</Button>
							</Box>
							<CollapsedContext
								context={ContextGeneratorService.convertContextToText(
									context
								)}
							/>
						</CardContent>
					</Card>

					{query.questions?.map((question, index) => (
						<>
							<motion.div
								animate={{
									y: stage >= 1 ? 0 : 50,
									opacity: stage >= 1 ? 1 : 0,
								}}
								transition={{ duration: 0.5 }}
							>
								<Card
									elevation={3}
									className="mb-4 w-full bg-green-50"
								>
									<CardContent>
										<Box
											display="flex"
											justifyContent="space-between"
											alignItems="center"
											mb={2}
										>
											<Box
												display="flex"
												alignItems="center"
											>
												<Avatar
													className="mr-2"
													sx={{
														backgroundColor:
															"#22c55e",
													}}
												>
													<QuestionMarkIcon />
												</Avatar>
												<Typography variant="h6">
													Question
												</Typography>
											</Box>
											<Button
												variant="outlined"
												color="primary"
												startIcon={<EditIcon />}
												onClick={handleEditQuestion}
											>
												Edit
											</Button>
										</Box>
										<Typography
											variant="body1"
											gutterBottom
											className="font-bold"
										>
											{question.title}
										</Typography>
										<Grid
											container
											spacing={2}
											className="mt-2"
										>
											{question.answer.options.map(
												(option, index) => (
													<Grid
														item
														xs={12}
														sm={6}
														key={index}
													>
														<Card
															variant="outlined"
															className="bg-white"
														>
															<CardContent>
																<Typography variant="body2">
																	Option{" "}
																	{index + 1}:{" "}
																	{option}
																	{index ===
																		question
																			.answer
																			.correct && (
																		<CheckCircleIcon
																			className="text-green-500 ml-2"
																			fontSize="small"
																		/>
																	)}
																</Typography>
															</CardContent>
														</Card>
													</Grid>
												)
											)}
										</Grid>
									</CardContent>
								</Card>
							</motion.div>
							<AnimatePresence>
								{isProcessing && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										exit={{ scale: 0 }}
										transition={{ duration: 0.5 }}
										className="flex justify-center mb-4"
									>
										<CircularProgress />
									</motion.div>
								)}
							</AnimatePresence>
							{Object.entries(llmResults).map(
								([llm, result], index) => (
									<motion.div
										key={llm}
										initial={{ x: -50, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{
											duration: 0.5,
											delay: index * 0.2,
										}}
									>
										<Card
											elevation={3}
											className="mb-4 bg-yellow-500"
										>
											<CardContent>
												<Box
													display="flex"
													alignItems="center"
													mb={2}
												>
													<Avatar
														className="bg-yellow-500 mr-2"
														sx={{
															backgroundColor:
																"#eab308",
														}}
													>
														<SmartToyIcon />
													</Avatar>
													<Typography variant="h6">
														{llmApis[llm].name}{" "}
														Answer
													</Typography>
												</Box>
												<Typography
													variant="body1"
													className="font-bold"
													gutterBottom
												>
													{result[index].option ===
													"0"
														? "No answer"
														: "Option " +
														  result[index].option +
														  ": " +
														  query.questions[index]
																.answer.options[
																result[index]
																	.option - 1
														  ]}
												</Typography>
												<Box
													display="flex"
													alignItems="center"
													mt={1}
												>
													{result[index].verdict ===
													"right" ? (
														<CheckCircleIcon className="text-green-500 mr-2" />
													) : (
														<CancelIcon className="text-red-500 mr-2" />
													)}
													<Chip
														label={
															result[index]
																.verdict ===
															"right"
																? "Correct"
																: "Incorrect"
														}
														color={
															result[index]
																.verdict ===
															"right"
																? "success"
																: "error"
														}
														size="small"
													/>
												</Box>
											</CardContent>
										</Card>
									</motion.div>
								)
							)}
						</>
					))}

					{showLoginPrompt && (
						<motion.div
							initial={{ y: 50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							{isAuthenticated ? (
								<Box
									// mt={3}
									// p={2}
									// bgcolor="background.paper"
									borderRadius={1}
									className="mt-4 p-4 bg-blue-50 rounded-lg w-full"
								>
									<Typography variant="h6" gutterBottom>
										Would you like to save this evaluation?
									</Typography>
									<Box
										display="flex"
										className="gap-2"
										mt={1}
									>
										<Button
											onClick={handleSave}
											variant="contained"
											color="primary"
											startIcon={<Save />}
										>
											Save
										</Button>
										<Button
											onClick={() => setOpen(true)}
											variant="outlined"
										>
											No, thanks
										</Button>
									</Box>
								</Box>
							) : (
								<LoginPrompt onLogin={handleLogin} />
							)}
						</motion.div>
					)}
				</motion.div>
			</Box>
		</Container>
	);
}

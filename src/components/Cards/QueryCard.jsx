import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	Paper,
	Button,
	IconButton,
	Card,
	Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LLMAnswers from "../Tables/LLMAnswers";
import QueryEditButton from "@/components/Buttons/QueryEditButton";
import CollapsedContext from "./CollapsedContext";
import OptionsPreview from "../Lists/OptionsPreview";
import { getUserName } from "@/api/base";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import {
	Delete,
	Save,
	GetApp,
	Rule,
	AssignmentTurnedIn,
	Api,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import { AppContext } from "@/contexts/AppContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import Pluralize from "pluralize";
import ContextPreview from "../GoogleMaps/ContextPreview";
export default function QueryCard({ entry, onEdit, isPersonal, mode, index }) {
	const [flag, setFlag] = useState(false);
	const { setQueries } = useContext(AppContext);
	const { isAuthenticated } = useAuth();
	const [expanded, setExpanded] = useState(index === 0);
	const [contextExpanded, setContextExpanded] = useState(false);

	const handleDelete = async () => {
		if (isAuthenticated) {
			const res = await queryApi.deleteNewQuery(entry.id);
			if (res.success) {
				setQueries((prev) => prev.filter((q) => q.id !== entry.id));
				showSuccess("Query deleted successfully");
			} else {
				showError("Can't delete query");
			}
		} else {
			setQueries((prev) => prev.filter((q) => q.id !== entry.id));
			showSuccess("Query deleted successfully");
		}
	};

	const toggleAccordion = () => setExpanded(!expanded);

	const handleDownloadQuery = () => {
		const jsonString = JSON.stringify(entry, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = `query_${entry.id}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	return (
		<Card elevation={2}>
			<div
				className="p-4 cursor-pointer flex flex-row"
				onClick={toggleAccordion}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "95%",
					}}
					className="gap-2"
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-start",
								width: "70%",
								alignItems: "center",
							}}
							className="gap-2"
						>
							<Typography sx={{ width: "3rem" }}>
								#{entry.id}
							</Typography>

							{/* <Box className="flex gap-2">
								{entry.classification
									.split(",")
									.map((label, index) => (
										<Chip
											label={convertFromSnake(label)}
											key={index}
											color="primary"
										/>
									))}
							</Box> */}
						</Box>

						{/* <h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
							<FontAwesomeIcon icon={faUser} />
							{entry.username}
						</h2> */}
					</Box>
					<div className="flex flex-row gap-4 justify-between items-start w-full">
						<div className="flex-grow min-w-0">
							<h6
								className={`mt-2 ${
									expanded
										? "whitespace-pre-line"
										: "truncate"
								}`}
							>
								{entry.name}
							</h6>
						</div>
						{flag && (
							<Chip
								label={"Invalid"}
								color="error"
								className="ml-auto"
							/>
						)}
					</div>
				</Box>
				<Box className="my-auto">
					<IconButton
						edge="end"
						className="ml-auto my-auto"
						size="small"
						sx={{
							transform: expanded
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "0.3s",
						}}
					>
						<ExpandMoreIcon />
					</IconButton>
				</Box>
			</div>
			{expanded && (
				<div className="p-4 bg-white">
					{/* {context && (
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Context:
							</Typography>
							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								<CollapsedContext context={context} />
							</Paper>
						</Box>
					)} */}
					<Box sx={{ mb: 2 }}>
						<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
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
									<ExpandMoreIcon />
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
										savedPlacesMap={
											entry.context_json.places
										}
										selectedPlacesMap={
											entry.context_json.place_details
										}
										nearbyPlacesMap={
											entry.context_json.nearby_places
										}
										// distanceMatrix={
										// 	entry.context_json.distance_matrix
										// }
										directionInformation={
											entry.context_json.directions
										}
										routePlacesMap={
											entry.context_json.route_places
										}
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
											entry.context_json.places,
											entry.context_json.place_details,
											entry.context_json.nearby_places,
											entry.context_json.directions,
											entry.context_json.route_places
										).map((r, index) => (
											<Typography key={index}>
												({index + 1}) {r.label}
											</Typography>
										))}
									</Box>
								</>
							)}
						</Paper>
					</Box>

					<div className="flex flex-col gap-4">
						{entry.questions.map((question, i) => (
							<div key={i}>
								<Typography variant="h6" gutterBottom>
									Question {i + 1}:
								</Typography>
								<Paper
									elevation={1}
									sx={{ p: 2, bgcolor: "grey.100" }}
								>
									<Box sx={{ mb: 2 }}>
										<h6
											className={`${"whitespace-pre-line"}`}
										>
											{question.title}
										</h6>
									</Box>
									<OptionsPreview answer={question.answer} />
									<LLMAnswers entry={entry} index={i} />
								</Paper>
							</div>
						))}
					</div>

					{/* <OptionsPreview answer={entry.answer} /> */}

					{/* {!isPersonal && mode !== "explore" && (
						<Annotation query={entry} />
					)} */}

					{/* Only creator can edit his question */}
				</div>
			)}
			{(entry.username === getUserName() ||
				getUserName() === "admin") && (
				<div className="w-full flex flex-row justify-between gap-2 p-2 items-center">
					{getUserName() === "admin" ? (
						<div className="flex flex-row gap-2 mr-auto">
							<Button
								variant="contained"
								color="primary"
								size="small"
								onClick={async () => {
									const result =
										await queryApi.updateCategory(
											entry.id,
											category
										);
									if (result.success) {
										setQueries((prev) =>
											prev.map((q) =>
												q.id === entry.id
													? {
															...entry,
															classification:
																category,
													  }
													: q
											)
										);
										showSuccess(
											"Category updated successfully"
										);
									}
								}}
								startIcon={<Save />}
							>
								Save
							</Button>
						</div>
					) : (
						<div className="flex flex-row gap-2">
							<Chip
								icon={<AssignmentTurnedIn />}
								label={Pluralize(
									"Question",
									entry.questions.length ?? 0,
									true
								)}
								// size="small"
								color="primary"
								variant="outlined"
							/>
							<Chip
								icon={<Api />}
								label={Pluralize(
									"API Call",
									entry.api_call_logs?.length ?? 0,
									true
								)}
								// size="small"
								color="primary"
								variant="outlined"
							/>
						</div>
					)}

					<div className="flex gap-2">
						{mode === "explore" ? (
							<>
								<QueryEditButton
									{...{ onEdit }}
									query={entry}
								/>
							</>
						) : (
							<>
								<Button
									color="primary"
									startIcon={<GetApp />}
									onClick={handleDownloadQuery}
								>
									Download
								</Button>
								{/* <Button
									color="primary"
									startIcon={<Rule />}
									onClick={async () => {
										const res =
											await queryApi.submitForEvaluation(
												entry.id,
												context
											);
										if (res.success) {
											showSuccess(
												"Query submitted for evaluation"
											);
											console.log(res.data[0]);
											// Update the query with the evaluation
											setQueries((prev) =>
												prev.map((q) =>
													q.id === entry.id
														? {
																...entry,
																evaluation:
																	res.data[0],
														  }
														: q
												)
											);
										} else {
											showError(
												"Can't submit query for evaluation"
											);
										}
									}}
								>
									Evaluate
								</Button> */}
								<Button
									// variant="contained"
									color="error"
									startIcon={<Delete />}
									onClick={() => handleDelete()}
								>
									Delete
								</Button>
								<QueryEditButton
									{...{ onEdit }}
									query={entry}
								/>
							</>
						)}
					</div>
				</div>
			)}
		</Card>
	);
}
// export default function QueryCard({ entry, onEdit }) {
// 	const [flag, setFlag] = useState(false);
// 	const { setQueries } = useContext(AppContext);
// 	const { isAuthenticated } = useAuth();
// 	const [expanded, setExpanded] = useState(false);
// 	const [category, setCategory] = useState(entry.classification);

// 	const handleDelete = async () => {
// 		if (isAuthenticated) {
// 			const res = await queryApi.deleteQuery(entry.id);
// 			if (res.success) {
// 				setQueries((prev) => prev.filter((q) => q.id !== entry.id));
// 				showSuccess("Query deleted successfully");
// 			} else {
// 				showError("Can't delete query");
// 			}
// 		} else {
// 			setQueries((prev) => prev.filter((q) => q.id !== entry.id));
// 			showSuccess("Query deleted successfully");
// 		}
// 	};

// 	useEffect(() => {
// 		const invalid = entry.evaluation?.find(
// 			(e) =>
// 				e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
// 				e.verdict === "invalid"
// 		);
// 		if (invalid) {
// 			setFlag(true);
// 		} else {
// 			setFlag(entry.human.answer === 0);
// 		}
// 	}, [entry]);

// 	return (
// 		<Accordion key={entry.id} sx={{ mb: 2 }}>
// 			<AccordionSummary
// 				expandIcon={<ExpandMoreIcon />}
// 				aria-controls={`panel${entry.id}-content`}
// 				id={`panel${entry.id}-header`}
// 				onClick={() => setExpanded((prev) => !prev)}
// 			>
// 				<Box
// 					sx={{
// 						display: "flex",
// 						flexDirection: "column",
// 						width: "100%",
// 					}}
// 					className="gap-2"
// 				>
// 					<Box
// 						sx={{
// 							display: "flex",
// 							justifyContent: "space-between",
// 							width: "99%",
// 						}}
// 					>
// 						<Box
// 							sx={{
// 								display: "flex",
// 								justifyContent: "flex-start",
// 								width: "70%",
// 								flexGap: "1rem",
// 								alignItems: "center",
// 							}}
// 						>
// 							<Typography sx={{ width: "20%" }}>
// 								#{entry.id}
// 							</Typography>

// 							<Box className="flex gap-2">
// 								{entry.classification
// 									.split(",")
// 									.map((label, index) => (
// 										<Chip
// 											label={convertFromSnake(label)}
// 											key={index}
// 											color="primary"
// 										/>
// 									))}
// 							</Box>
// 						</Box>

// 						<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
// 							<FontAwesomeIcon icon={faUser} />
// 							{entry.username}
// 						</h2>
// 					</Box>
// 					<div className="flex flex-row gap-4 justify-between items-start w-full">
// 						<div className="flex-grow min-w-0">
// 							<h6
// 								className={`mt-2 ${
// 									expanded
// 										? "whitespace-pre-line"
// 										: "truncate"
// 								}`}
// 							>
// 								{entry.question}
// 							</h6>
// 						</div>
// 						{flag && (
// 							<Chip
// 								label={"Invalid"}
// 								color="error"
// 								className="ml-auto"
// 							/>
// 						)}
// 					</div>
// 				</Box>
// 			</AccordionSummary>
// 			<AccordionDetails>
// 				<Box sx={{ mb: 2 }}>
// 					<Typography variant="h6" gutterBottom>
// 						Context:
// 					</Typography>
// 					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
// 						<CollapsedContext context={entry.context} />
// 					</Paper>
// 				</Box>
// 				<OptionsPreview answer={entry.answer} />
// 				<LLMAnswers evaluation={entry.evaluation} />
// 				<Annotation query={entry} />
// 				{/* Only creator can edit his question */}
// 				{(entry.username === getUserName() ||
// 					getUserName() === "admin") && (
// 					<div className="w-full flex flex-row justify-end gap-2 mt-2">
// 						{getUserName() === "admin" && (
// 							<div className="flex flex-row gap-2 mr-auto">
// 								<FormControl
// 									variant="outlined"
// 									className="w-[20rem]"
// 									size="small"
// 									required
// 								>
// 									<InputLabel>Category</InputLabel>
// 									<Select
// 										required
// 										multiple
// 										label={"Category"}
// 										placeholder="Choose a category of the question"
// 										id="outlined-adornment"
// 										className="outlined-input"
// 										value={category
// 											.split(",")
// 											.filter(Boolean)}
// 										onChange={(e) => {
// 											setCategory(
// 												e.target.value.join(",")
// 											);
// 										}}
// 										renderValue={(selected) => (
// 											<Box
// 												sx={{
// 													display: "flex",
// 													flexWrap: "wrap",
// 													gap: 0.5,
// 												}}
// 											>
// 												{selected.map((value) => (
// 													<Chip
// 														key={value}
// 														label={convertFromSnake(
// 															value
// 														)}
// 														size="small"
// 													/>
// 												))}
// 											</Box>
// 										)}
// 									>
// 										{categories.map((value, index) => (
// 											<MenuItem key={index} value={value}>
// 												{convertFromSnake(value)}
// 											</MenuItem>
// 										))}
// 									</Select>
// 								</FormControl>
// 								<Button
// 									variant="contained"
// 									color="primary"
// 									size="small"
// 									onClick={async () => {
// 										const result =
// 											await queryApi.updateCategory(
// 												entry.id,
// 												category
// 											);
// 										if (result.success) {
// 											setQueries((prev) =>
// 												prev.map((q) =>
// 													q.id === entry.id
// 														? {
// 																...entry,
// 																classification:
// 																	category,
// 														  }
// 														: q
// 												)
// 											);
// 											showSuccess(
// 												"Category updated successfully"
// 											);
// 										}
// 									}}
// 									startIcon={<Save />}
// 								>
// 									Save
// 								</Button>
// 							</div>
// 						)}

// 						<Button
// 							// variant="contained"
// 							color="error"
// 							startIcon={<Delete />}
// 							onClick={() => handleDelete()}
// 						>
// 							Delete
// 						</Button>
// 						<QueryEditButton {...{ onEdit }} query={entry} />
// 					</div>
// 				)}
// 			</AccordionDetails>
// 		</Accordion>
// 	);
// }

import { Close, ContentCopy } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography, Zoom } from "@mui/material";
import React, { useState, useEffect } from "react";
// import { ContentCopy } from "lucide-react";

const PromptDesigner = ({ query, onClose }) => {
	const [context, setContext] = useState("");
	const [question, setQuestion] = useState("");
	const [choices, setChoices] = useState("");
	const [prompt, setPrompt] = useState("");
	const [copied, setCopied] = useState(false);
	const [contextType, setContextType] = useState("json");
	// Generate prompt whenever inputs change
	const generatePrompt = () => {
		let generatedPrompt = "";

		if (contextType === "text") {
			generatedPrompt += `Context:\n${query.context}\n\n`;
		} else {
			generatedPrompt += `Context:\n${JSON.stringify(
				query.context_json,
				null,
				2
			)}\n\n`;
		}

		generatedPrompt += `Question:\n${query.question}\n\n`;

		if (query.answer.options?.length) {
			generatedPrompt += `Choices:\n${query.answer.options
				.map((option, index) => `(${index + 1}) ${option}`)
				.join("\n")}`;
		}

		return generatedPrompt.trim();
	};

	useEffect(() => {
		setPrompt(generatePrompt());
	}, [query, contextType]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(prompt);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Zoom in={true}>
			<Paper
				elevation={3}
				className="w-[90%] mx-auto mt-[64px] rounded-lg"
			>
				<div
					className="flex flex-col bg-gray-200  rounded-lg"
					style={{
						height: "calc(100vh - 128px)",
						maxHeight: "calc(100vh - 128px)",
					}}
				>
					<div className="p-4 text-white h-16 flex flex-row justify-between items-center">
						<h1 className="text-2xl font-bold text-black">
							Prompt Designer
						</h1>
						<IconButton
							onClick={onClose}
							className="text-white h-12 w-12"
						>
							<Close size="large" />
						</IconButton>
					</div>

					<div className="flex flex-row h-full bg-gray-50 rounded-b-lg">
						{/* Left Panel - Editable Inputs */}
						<div className="w-1/2 p-4 overflow-y-auto border-r">
							<div
								class="flex flex-col gap-2"
								style={{
									height: "calc(100vh - 224px)",
								}}
							>
								<div className="h-1/3">
									<Box className="flex flex-col gap-2 h-full">
										<Box className="flex flex-row gap-2 justify-between items-center">
											<label className="font-medium text-gray-700">
												Context
											</label>
											{/* <select
											className="border border-gray-400 rounded-md p-2 font-mono text-sm whitespace-pre bg-gray-50 h-full overflow-auto"
											value={contextType}
											onChange={(e) =>
												setContextType(e.target.value)
											}
										>
											<option value="text">Text</option>
											<option value="json">JSON</option>
										</select> */}
											<Box className="flex gap-[1px] items-center rounded-2xl bg-gray-400 border-[1px] border-gray-400 w-36 cursor-pointer">
												<Box
													className={`bg-white  p-2 py-1 rounded-l-2xl w-1/2 text-center ${
														contextType === "text"
															? "bg-blue-200"
															: "bg-white"
													} hover:bg-blue-300`}
													onClick={() =>
														setContextType("text")
													}
												>
													Text
												</Box>
												<Box
													className={`bg-white  p-2 py-1 rounded-r-2xl w-1/2 text-center ${
														contextType === "json"
															? "bg-blue-200"
															: "bg-white"
													} hover:bg-blue-300`}
													onClick={() =>
														setContextType("json")
													}
												>
													JSON
												</Box>
											</Box>
										</Box>

										<Box className="flex-1 border border-gray-400 rounded-md p-3 font-mono text-sm whitespace-pre bg-gray-50 h-full overflow-auto">
											<div
												variant="body2"
												// className="overflow-y-auto h-full overflow-x-auto"
											>
												{contextType === "text"
													? query.context
													: JSON.stringify(
															query.context_json,
															null,
															2
													  )}
											</div>
										</Box>
									</Box>
								</div>

								<div className="h-1/3">
									<Box className="flex flex-col gap-2 h-full">
										<label className="font-medium text-gray-700">
											Question
										</label>
										<Box className="flex-1 border border-gray-400 rounded-md p-3 font-mono text-sm whitespace-pre-wrap bg-gray-50 h-full overflow-y-auto">
											<div
												variant="body1"
												// className="overflow-y-auto h-full"
											>
												{query.question}
												{/* {JSON.stringify(
											query.context_json,
											null,
											2
										)} */}
											</div>
										</Box>
									</Box>
								</div>

								<div className="h-1/3">
									<Box className="flex flex-col gap-2 h-full">
										<label className="font-medium text-gray-700">
											Choices
										</label>
										<Box className="flex-1 border border-gray-400 rounded-md p-3 font-mono text-sm whitespace-pre-wrap bg-gray-50 overflow-y-auto h-full">
											<div
												variant="body1"
												// className="overflow-y-auto h-full"
											>
												{query.answer.options?.map(
													(option, index) => (
														<div key={index}>
															<b>({index + 1})</b>{" "}
															{option}
														</div>
													)
												)}
												{/* {JSON.stringify(
											query.context_json,
											null,
											2
										)} */}
											</div>
										</Box>
									</Box>
								</div>
							</div>
						</div>

						{/* Right Panel - Generated Prompt */}
						<div
							className="w-1/2 p-4 overflow-y-auto"
							style={{ height: "calc(100vh - 192px)" }}
						>
							<div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 h-full flex flex-col">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-lg font-medium text-gray-900">
										Generated Prompt ({prompt.length} chars)
									</h2>
									<button
										onClick={copyToClipboard}
										className={`p-2 rounded-md flex items-center gap-1 ${
											copied
												? "bg-green-100 text-green-700"
												: "bg-blue-100 text-blue-700 hover:bg-blue-200"
										}`}
									>
										<ContentCopy size={16} />
										<span className="text-sm">
											{copied ? "Copied!" : "Copy"}
										</span>
									</button>
								</div>

								<div className="flex-1 border border-gray-200 rounded-md p-3 font-mono text-sm whitespace-pre bg-gray-50 overflow-y-auto">
									{prompt || (
										<span className="text-gray-600">
											{prompt}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Paper>
		</Zoom>
	);
};

export default PromptDesigner;

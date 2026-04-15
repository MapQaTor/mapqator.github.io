import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Paper,
	Chip,
} from "@mui/material";

const extract = (s) => {
	for (let char of s) {
		if (/\d/.test(char)) {
			return char;
		}
	}
	return null;
};

const extractSubstringInParentheses = (s) => {
	const match = s?.match(/\(([^)]+)\)/);
	return match ? match[1] : null;
};

export default function LLMAnswers({ entry, index }) {
	console.log(entry.evaluation);
	const results =
		entry.evaluation?.length &&
		entry.evaluation.map((e) => {
			const responses = e.responses;
			if (!responses && responses.length < index + 1) return null;
			const response = responses[index];
			// const option = parseInt(extract(response));
			const option = response.option;
			const model = e.model;
			// const answer = entry.questions[index].answer.correct + 1;
			// const verdict = option === answer ? "right" : "wrong";
			const verdict = response.verdict;
			const explanation = response.explanation;
			return {
				model,
				option,
				verdict,
				explanation,
			};
		});
	return (
		<>
			{results?.length > 0 && (
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						LLM Answers:
					</Typography>
					<TableContainer component={Paper}>
						<Table size="small">
							<TableHead>
								<TableRow
									sx={{
										fontWeight: "bold",
										color: "black",
									}}
									className="bg-gray-200"
								>
									<TableCell
										sx={{
											width: "10%",
											fontWeight: "bold",
										}}
									>
										Model
									</TableCell>
									<TableCell
										align="center"
										sx={{
											width: "65%",
											fontWeight: "bold",
										}}
									>
										Explanation
									</TableCell>
									<TableCell
										align="center"
										sx={{
											width: "15%",
											fontWeight: "bold",
										}}
									>
										Choice
									</TableCell>
									<TableCell
										align="center"
										sx={{
											width: "10%",
											fontWeight: "bold",
										}}
									>
										Correct?
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{results?.map(
									(llmAnswer, index) =>
										llmAnswer && (
											<TableRow key={index}>
												<TableCell>
													{llmAnswer.model}
												</TableCell>
												<TableCell
													align="center"
													sx={
														{
															// fontSize: "0.65rem",
														}
													}
												>
													{llmAnswer.explanation}
												</TableCell>
												<TableCell align="center">
													Option {llmAnswer.option}
												</TableCell>

												<TableCell align="center">
													{llmAnswer.verdict ===
													"right" ? (
														<Chip
															label="Correct"
															color="success"
															size="small"
														/>
													) : (
														<Chip
															label="Incorrect"
															color="error"
															size="small"
														/>
													)}
												</TableCell>
											</TableRow>
										)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			)}
		</>
	);
}

import { useState, useEffect, useContext } from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { AppContext } from "@/contexts/AppContext";

export default function DatasetSummary() {
	const [datasetSummary, setDatasetSummary] = useState({});
	const { queries } = useContext(AppContext);
	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		let total_questions = 0;
		let questions_without_context = 0;
		let questions_with_answer = 0;

		queries.forEach((query) => {
			total_questions++;
			if (query.context === "") {
				questions_without_context++;
			}
			if (query.answer.correct !== -1) {
				questions_with_answer++;
			}
			if (query.context !== "") {
				const invalid = query.evaluation?.find(
					(e) =>
						e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
						e.verdict === "invalid"
				);
				if (!invalid) valid_questions++;
			}
		});
		tmp["totalQuestions"] = total_questions;
		tmp["questionsWithoutContext"] = questions_without_context;
		tmp["questionsWithoutCorrectAnswer"] =
			total_questions - questions_with_answer;
		tmp["validQuestions"] = valid_questions;
		setDatasetSummary(tmp);
	}, [queries]);

	return (
		<TableContainer component={Paper} sx={{ mb: 4 }}>
			<Table>
				<TableHead>
					<TableRow
						sx={{
							fontWeight: "bold",
							color: "black",
						}}
						className="bg-gray-200"
					>
						<TableCell sx={{ fontWeight: "bold" }}>
							{" "}
							Dataset Summary
						</TableCell>
						<TableCell align="right" sx={{ fontWeight: "bold" }}>
							Count
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell>Total Questions</TableCell>
						<TableCell align="right">
							{datasetSummary.totalQuestions}
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell>Questions Without Context</TableCell>
						<TableCell align="right">
							{datasetSummary.questionsWithoutContext}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Questions Without Correct Answer</TableCell>
						<TableCell align="right">
							{datasetSummary.questionsWithoutCorrectAnswer}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Valid Questions</TableCell>
						<TableCell align="right">
							{datasetSummary.validQuestions}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

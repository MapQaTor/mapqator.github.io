"use client";

import React, { useContext, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Chip,
	CircularProgress,
	CardContent,
	Card,
	Avatar,
} from "@mui/material";
import { Description, Edit, QuestionMark, Send } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import OptionsEditor from "@/components/InputFields/OptionsEditor";
import CorrectAnswerEditor from "@/components/InputFields/CorrectAnswerEditor";
import { useRouter } from "next/navigation";

export default function ProvideAnswerPage() {
	return;
	const { query, context, setAnswerStatus } = useContext(GlobalContext);
	const [answer, setAnswer] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleAnswerChange = (event) => {
		setAnswer(event.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setAnswerStatus("saved");
		router.push("/home/review");
	};

	const handleEditQuestion = () => {
		router.push("/home/question");
	};
	return (
		<Box sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Provide Answer
			</Typography>

			<Card elevation={3} className="mb-4 w-full bg-green-50">
				<CardContent>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
					>
						{" "}
						<Box display="flex" alignItems="center">
							<Avatar
								className="mr-2"
								sx={{ backgroundColor: "#22c55e" }}
							>
								<QuestionMark />
							</Avatar>
							<Typography variant="h6">Question</Typography>
						</Box>
						<Button
							variant="outlined"
							color="primary"
							startIcon={<Edit />}
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
						{query.question}
					</Typography>
					<Chip
						label={query.classification}
						color="primary"
						sx={{ mr: 1 }}
					/>
				</CardContent>
			</Card>

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
								<Description />
							</Avatar>
							<Typography variant="h6">
								Reference Information
							</Typography>
						</Box>
						<Button
							variant="outlined"
							color="primary"
							startIcon={<Edit />}
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

			{/* <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					Question:
				</Typography>
				<Typography variant="body1" paragraph>
					{query.question}
				</Typography>
				<Chip
					label={query.classification}
					color="primary"
					sx={{ mr: 1 }}
				/>
			</Paper> */}

			<form onSubmit={handleSubmit}>
				<OptionsEditor />
				<CorrectAnswerEditor />
				{/* <TextField
					fullWidth
					multiline
					rows={6}
					variant="outlined"
					label="Your Answer"
					placeholder="Provide your detailed answer here..."
					value={answer}
					onChange={handleAnswerChange}
					sx={{ mb: 2 }}
				/> */}
				<Button
					type="submit"
					variant="contained"
					color="primary"
					endIcon={
						isSubmitting ? <CircularProgress size={24} /> : <Send />
					}
					disabled={query.answer === -1 || isSubmitting}
				>
					Submit Answer
				</Button>
			</form>
		</Box>
	);
}
